import java.util.ArrayList;
import java.util.Map;
import java.util.Scanner;

public class EscapeDA {
    public static WAdjacencyGraph<Area> buildGraph(Map<Area, ArrayList<Area>> passages){
        WAdjacencyGraph<Area> graph = new WAdjacencyGraph<>();
        for(Area key : passages.keySet()){
            graph.add(key);
            for(Area area : passages.get(key)){
                graph.add(area);
                if(area.isHaunted()){
                    graph.connect(key, area, 1000);
                }
                else{
                    graph.connect(key, area, 1);
                }
                //System.out.println(key + "-->" + area);
            }
        }
        return graph;
    
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a building floor plan .csv file: ");
        String input = scanner.nextLine();
        BuildingFileParser BFT = new BuildingFileParser(input);
        WAdjacencyGraph<Area> graph = buildGraph(BFT.getPassages());
        Area start = BFT.getStartArea();
        System.out.println("You awake in the " + start + " and desperately need to find a way out!");
        System.out.println("Haunted Areas:");
        for(Area area : BFT.getHauntedAreas()){
            System.out.println("\t" + area);
        }
        for(Area end : BFT.getExitAreas()){
            WPath<Area> path = graph.dijkstrasPath(start, end);
            if(path != null){
                System.out.println("You found the shortest way out!");
                System.out.println(path);
            }
            else{
                System.out.println("There is no escape. You will haunt the grounds for all eternity.");
            }
        }
        scanner.close();
    }
}
