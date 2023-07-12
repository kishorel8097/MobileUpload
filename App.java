import java.util.ArrayList;
import java.util.Date;

// import com.example.Rgba;

public class App {
    public static void main(String[] args) throws Exception {
        ArrayList<Rgba> rgba = new ArrayList<Rgba>();

        for (int i = 0; i < 2500; i++) {
            rgba.add(new Rgba((int) (Math.random() * 255), (int) (Math.random() * 255), (int) (Math.random() * 255),
                    (int) (Math.random() * 255)));
        }

        Date startTime = new Date();
        for (Rgba rgba2 : rgba) {
            System.out.println(rgba2);
        }
        System.out.println();
        System.out.println(startTime);
        System.out.println(new Date());

    }
}

class Rgba {
    int r, g, b, a;

    public Rgba(int r, int g, int b, int a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
