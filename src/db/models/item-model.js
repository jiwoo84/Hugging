import { model } from "mongoose";
import { itemSchema } from "../schemas/item-schema";
const Item = model("Item", itemSchema);
export { Item };
