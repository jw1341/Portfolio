import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class WVertex<E> {
    private E value;
    private Map<WVertex<E>, Edge<E>> neighbors; // {nbr1: edge1, nbr2: edge2, nbr3: edge3}

    public WVertex(E value) {
        this.value = value;
        this.neighbors = new HashMap<>();
    }

    public E getValue() {
        return value;
    }

    public void connect(WVertex<E> nbr, double weight) { // this --> nbr, weight
        Edge<E> edge = new Edge<>(this, nbr, weight);
        neighbors.put(nbr, edge);
    }

    public Edge<E> edge(WVertex<E> nbr) { // this --- nbr
        // what is nbr is not in neighbors, this vertex is not connected to nbr, get()
        // will return null
        return neighbors.get(nbr); // edge or null
    }

    public Set<Edge<E>> edges() {
        Set<Edge<E>> sortedEdges = new TreeSet<>(); // maintain sorted elements by natural order
        for (Edge<E> edge : neighbors.values()) {
            sortedEdges.add(edge);
        }
        return sortedEdges; // lightest edge first
    }

    @Override
    public String toString() {
        return this.value.toString();
    }

}