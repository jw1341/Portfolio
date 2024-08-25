public class Area {
    private String name;
    private AreaType type;
    private String evilPresence;

    public Area(String name, AreaType type){
        this.name = name;
        this.type = type;
        this.evilPresence = null;
    }
    public String getName(){
        return name;
    }
    public AreaType getType(){
        return type;
    }
    public boolean isHaunted(){
        return evilPresence != null;
    }
    public void haunt(String evilPresence){
        this.evilPresence = evilPresence;
    }
    @Override
    public boolean equals(Object other) {
        if(other instanceof Area){
            Area otherArea = (Area)other;
            return this.name.equals(otherArea.getName());
        }
        return false;
    }
    @Override
    public String toString() {
        if(isHaunted() != true){
            return name + " " + "[" + type + "]";
        }
        return name + " "+ "[" + type + "/" + evilPresence + "]";
    }
    public int hashCode(){
        return this.name.hashCode();
    }
}
