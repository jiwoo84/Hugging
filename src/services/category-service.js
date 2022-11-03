import { Category, Item } from "../db";
class CategoryService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async newCategory(data) {
    const { index, name } = data; // name = 홈 -> 홈 item

    // 8~15 입력 카테고리이름으로 이미 만들어졌었던 item들을 arr 배열에 담음
    let arr = [];
    const items = await Item.find({ category: name });
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id) {
        arr.push(items[i]._id);
      }
    }
    const checkName = await Category.findOne({ name });
    if (checkName) {
      throw new Error("이미 존재하는 카테고리 이름");
    }
    // 새로운 카테고리 생성, name:name. items:위에서 만든 arr
    const newCategory = await Category.create({
      name,
      index,
      items: arr,
    });
    return newCategory;
  }
  async updateCategory(data) {
    const { name, index } = data;
    const fixedCategory = await Category.updateOne({ name }, {});
  }

  async categoriesItems(data) {
    const { name, index } = data;
    const result = await Category.findOne({
      name,
      index,
    }).populate("items");
    let resultArr = [];
    for (let i = 0; i < result.items.length; i++) {
      let obj = {};
      obj = result.items[i];
      resultArr.push(obj);
    }
    resultArr.sort(-1);
    console.log(resultArr);
    return resultArr;
  }
}

const categoryService = new CategoryService();

export { categoryService };
