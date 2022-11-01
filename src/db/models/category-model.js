import { model } from "mongoose";
import { categorySchema } from "../schemas/category-schema";

const Category = model("Category", categorySchema);

export { Category };

// 미리 카테고리가 만들어져있어야 되지 않나요 ?
// /api/category Post => 이름 카테고리 doc 만들어줌.-> item{category:name}
