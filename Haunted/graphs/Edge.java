public class Edge<E> implements Comparable<Edge<E>> {
    private WVertex<E> from;
    private WVertex<E> to;
    private double weight;

    public Edge(WVertex<E> from, WVertex<E> to, double weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    public WVertex<E> getFrom() {
        return from;
    }

    public WVertex<E> getTo() {
        return to;
    }

    public double getWeight() {
        return weight;
    }

    @Override
    public int compareTo(Edge<E> other) {
        if (this.weight <= other.weight) {
            return -1;
        } else {
            return 1;
        }
    }
}
