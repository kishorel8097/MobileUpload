/** The function takes in a json as parameter and returns a model class that represents the object. */
export function createClassFromJson(
  obj: any,
  className: string,
  exportClass?: boolean,
  baseClass?: string
) {
  obj = {
    name: "Name",
    age: 1,
    skills: null,
    experiences: [
      { skill: "js", exp: 1 },
      { skill: "ts", exp: 2 },
    ],
    emptyArrayProp: [],
  };

  console.log(
    (exportClass ? "export " : "") +
      "class " +
      className +
      " " +
      (baseClass ? "extends " + baseClass + " " : "") +
      createClass(obj)
  );
}

function createClass(obj: any, sub: boolean = false, level: number = 1) {
  if (typeof obj !== "object") return typeof obj;
  if (obj === null) return "any";

  const arr: string[] = [];
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (typeof obj[key] !== "object")
      arr.push("\t".repeat(level) + key + ": " + typeof obj[key]);
    else if (obj[key] instanceof Array && obj[key].length)
      arr.push(
        "\t".repeat(level) +
          key +
          ": " +
          (typeof obj[key][0] === "object" ? "{\n" : "") +
          createClass(obj[key][0], true, level + 1) +
          (typeof obj[key][0] === "object"
            ? "\n" + "\t".repeat(level) + "}"
            : "") +
          "[]"
      );
    else if (obj[key] instanceof Array)
      arr.push("\t".repeat(level) + key + ": any[]");
    else if (typeof obj[key] === "object")
      obj[key] === null
        ? arr.push("\t".repeat(level) + key + ": any")
        : arr.push(
            "\t".repeat(level) +
              key +
              ": {\n" +
              createClass(obj[key], true, level + 1) +
              "\n" +
              "\t".repeat(level) +
              "}"
          );
  });
  return (
    (!sub ? "{\n" : "") + arr.join(";\n").concat(";") + (!sub ? "\n}" : "")
  );
}
