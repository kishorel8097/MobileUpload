public class Program
{
    public static void main(String[] args) {
        MyClassParams params1 = new MyClassParams().setProp1("Prop 1").setProp2("Prop 2");
        System.out.println(params1.prop1);
    }
}

class MyClass {
    public String prop1, prop2;
}

public static class MyClassParams {
    public String prop1, prop2;
    
    public Prop2Param setProp1(String prop1) {
        this.prop1 = prop1;
        return new Prop2Param();
    }
    
    public class Prop2Param {
        public MyClassParams setProp2(String prop2) {
            MyClassParams.this.prop2 = prop2;
            return new MyClassParams();
        }
    }
}
