import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class WAdjacencyGraph<E> implements WGraph<E> {
    private Map<E, WVertex<E>> vertices; // value -> vertex

    public WAdjacencyGraph() {
        this.vertices = new HashMap<>();
    }

    @Override
    public void add(E value) {
        WVertex<E> vertex = new WVertex<>(value);
        vertices.put(value, vertex);

    }

    @Override
    public boolean contains(E value) {
        return vertices.containsKey(value);
    }

    @Override
    public int size() {
        return vertices.size();
    }

    @Override
    public void connect(E a, E b, double weight) {
        WVertex<E> vertexA = vertices.get(a);
        WVertex<E> vertexB = vertices.get(b);
        vertexA.connect(vertexB, weight);
        vertexB.connect(vertexA, weight);
    }

    @Override
    public boolean connected(E a, E b) {
        WVertex<E> vertexA = vertices.get(a);
        WVertex<E> vertexB = vertices.get(b);
        return vertexA.edge(vertexB) != null;
    }

    @Override
    public double weight(E a, E b) {
        WVertex<E> vertexA = vertices.get(a);
        WVertex<E> vertexB = vertices.get(b);
        return vertexA.edge(vertexB).getWeight();
    }

    @Override
    public WPath<E> nearestNeighbors(E start, E end) {
        WVertex<E> s = vertices.get(start);
        WVertex<E> e = vertices.get(end);

        Set<WVertex<E>> visited = new HashSet<>();
        visited.add(s);

        return visitNNPath(s, e, visited);
    }

    private WPath<E> visitNNPath(WVertex<E> v, WVertex<E> e,
            Set<WVertex<E>> visited) {
        if (v == e) {
            WPath<E> path = new WPath<>(e.getValue());
            return path;
        } else {
            for (Edge<E> edge : v.edges()) { // edge = (v, neighbor), get the lowest cost edge
                WVertex<E> neighbor = edge.getTo();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    WPath<E> path = visitNNPath(neighbor, e, visited);
                    if (path != null) {
                        path.prepend(v.getValue(), edge.getWeight());
                        return path;
                    }
                }
            }
            return null;
        }
    }

    @Override
    public WPath<E> dijkstrasPath(E start, E end) {
        // 1. setup
        WVertex<E> startV = vertices.get(start);
        WVertex<E> endV = vertices.get(end);
        Map<WVertex<E>, WVertex<E>> predecessors = new HashMap<>();
        Map<WVertex<E>, Double> distances = new HashMap<>();
        List<WVertex<E>> priorityQueue = new LinkedList<>();
        for (WVertex<E> vertex : vertices.values()) {
            predecessors.put(vertex, null);
            distances.put(vertex, Double.MAX_VALUE);
            priorityQueue.add(vertex);
        }
        distances.put(startV, 0.0);

        // 2. main loop
        while (!priorityQueue.isEmpty()) {
            WVertex<E> V = removeMinDistVertex(priorityQueue, distances);
            if (distances.get(V) == Double.MAX_VALUE) {
                // V and all other remaining vertices in priortyQueue are unreachable
                break;
            }

            for (Edge<E> edge : V.edges()) { // V -- nbr
                WVertex<E> nbr = edge.getTo();
                // If the new path through V to nbr is better than that of nbr's curr path,
                // update nbr's predecessor and distance
                double distThroughV = distances.get(V) + edge.getWeight();
                if (distThroughV < distances.get(nbr)) {
                    predecessors.put(nbr, V);
                    distances.put(nbr, distThroughV);
                }
            }
        }

        // 3. build the path
        if (distances.get(endV) == Double.MAX_VALUE) {
            // nbr is not connected to startV, so no path exists
            return null;
        }
        return buildPath(predecessors, endV);
    }

    private WPath<E> buildPath(Map<WVertex<E>, WVertex<E>> predecessors, WVertex<E> endV) {
        WVertex<E> vertex = endV;
        WPath<E> path = new WPath<>(vertex.getValue());
        while (true) {
            WVertex<E> predecessor = predecessors.get(vertex);
            if (predecessor == null) {
                break;
            }
            path.prepend(predecessor.getValue(), predecessor.edge(vertex).getWeight());
            vertex = predecessor;
        }
        return path;
    }

    private WVertex<E> removeMinDistVertex(List<WVertex<E>> priorityQueue, Map<WVertex<E>, Double> distances) {
        WVertex<E> minVertex = priorityQueue.get(0);
        int minIndex = 0;
        for (int i = 1; i < priorityQueue.size(); i++) {
            WVertex<E> currVertex = priorityQueue.get(i);
            if (distances.get(minVertex) > distances.get(currVertex)) {
                minVertex = currVertex;
                minIndex = i;
            }
        }
        priorityQueue.remove(minIndex);
        return minVertex;
    }
}