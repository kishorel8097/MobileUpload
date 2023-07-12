import java.util.ArrayList;
import java.util.Date;
import java.util.Scanner;

import com.example.Rgba;

public class App {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        ArrayList<Rgba> rgba = new ArrayList<Rgba>();

        long number = scanner.nextLong();
        for (int i = 0; i < number; i++) {
            rgba.add(new Rgba((int) (Math.random() * 255), (int) (Math.random() * 255), (int) (Math.random() * 255),
                    (int) (Math.random() * 255)));
        }

        Date startTime = new Date();
        long n = 1;
        for (Rgba rgba2 : rgba) {
            System.out.println(rgba2);
        }
        System.out.println();
        System.out.println(n);
        System.out.println(number);
        System.out.println(startTime);
        System.out.println(new Date());
        scanner.close();
    }
}
