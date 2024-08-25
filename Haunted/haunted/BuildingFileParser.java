import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Random;
import java.util.Set;

public class BuildingFileParser {
    private static final Random RNG = new Random();
    private ArrayList<Area> safeAreas;
    private ArrayList<Area> exitAreas;
    private ArrayList<Area> hauntedAreas;
    private Map<Area, ArrayList<Area>> passages;
    private Set<Area> firstLineArea;

    public BuildingFileParser(String filename) {
        try(
            FileReader fr = new FileReader(filename);
            BufferedReader br = new BufferedReader(fr);
        ){  
            this.passages = new HashMap<>();
            this.firstLineArea = new HashSet<>();
            while(true){
                String line = br.readLine();
                if(line == null){
                    break;
                }
                String[] rooms = line.split(",");
                //System.out.println(Arrays.toString(rooms));
                //First room
                String[] first = rooms[0].split("-");
                AreaType firstType = makeType(first[1]);
                Area firstArea = new Area(first[0], firstType);
                if(firstLineArea.contains(firstArea)){
                    continue;
                }else{
                    firstLineArea.add(firstArea);
                }
                if(firstArea.getType() != AreaType.EXIT){
                    firstArea.haunt(EvilPresenceUtil.getRandomPresence());
                }
                // Connecting rooms
                ArrayList<Area> areas = new ArrayList<>();
                for(int i=1; i<rooms.length; i++){
                    String[] room = rooms[i].split("-");
                    AreaType type = makeType(room[1]);
                    Area area = new Area(room[0], type);
                    if(area.getType() != AreaType.EXIT){
                        area.haunt(EvilPresenceUtil.getRandomPresence());
                    }
                    areas.add(area);
                }
                passages.put(firstArea, areas);
                //System.out.println(passages);

                // Designating areas
                this.safeAreas = new ArrayList<>();
                this.exitAreas = new ArrayList<>();
                this.hauntedAreas = new ArrayList<>();

                setAreas(firstArea);
                for(Area area : passages.get(firstArea)){
                    setAreas(area);
                }
            }
            fr.close();
            br.close();
            // System.out.println(safeAreas);
            // System.out.println(hauntedAreas);
            // System.out.println(exitAreas);
        }
        catch(IOException ioe){
            System.out.println(ioe);
        }
    }

    public AreaType makeType(String stringType){
        AreaType type = null;
        if(stringType.equals("EXIT")){ // making room
            type = AreaType.EXIT;
        }
        else if(stringType.equals("HALLWAY")){
            type = AreaType.HALLWAY;
        }
        else{
            type = AreaType.ROOM;
        }
        return type;
    }
    public void setAreas(Area area){
        if(area.isHaunted()){
            hauntedAreas.add(area);
        }
        else if(!area.isHaunted() && area.getType() != AreaType.EXIT){
            safeAreas.add(area);
        }
        else{
            exitAreas.add(area);
        }
    }

    public ArrayList<Area> getSafeAreas(){
        return safeAreas;
    }
    public ArrayList<Area> getExitAreas(){
        return exitAreas;
    }
    public ArrayList<Area> getHauntedAreas(){
        return hauntedAreas;
    }
    public Map<Area, ArrayList<Area>> getPassages(){
        return passages;
    }
    public Area getStartArea(){
        return safeAreas.get(RNG.nextInt(safeAreas.size()));
    }
    public static void main(String[] args) {
        BuildingFileParser idk = new BuildingFileParser("..apartment.csv");
        System.out.println(idk.getStartArea());
        System.out.println(idk.getPassages());
        for(Area area : idk.passages.keySet()){
            System.out.println(area);
        }
    }
}

