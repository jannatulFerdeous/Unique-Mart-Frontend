// ExcelJS's prebuilt browser bundle, which the dashboard loads on demand
// (the package's main entry pulls in Node-only modules).
declare module "exceljs/dist/exceljs.min.js" {
  import ExcelJS from "exceljs";
  export default ExcelJS;
}
