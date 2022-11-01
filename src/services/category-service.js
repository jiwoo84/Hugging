import { Category, Item } from "../db";
class CategoryService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async newCategory(data) {
    const name = data; // name = 홈 -> 홈 item

    // 8~15 입력 카테고리이름으로 이미 만들어졌었던 item들을 arr 배열에 담음
    let arr = [];
    const items = await Item.find({ category: name });
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id) {
        arr.push(items[i]._id);
      }
    }

    // 새로운 카테고리 생성, name:name. items:위에서 만든 arr
    const newCategory = await Category.create({
      name,
      items: arr,
    });
    return newCategory;
  }
}

const categoryService = new CategoryService();

export { categoryService };
