import { Category, Item } from "../db";
class CategoryService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  // 카테고리 전부 조회
  async getAll() {
    const categories = await Category.find();
    return categories;
  }

  //카테고리 만들기
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
    const checkIndex = await Category.findOne({ index });
    if (checkName) {
      throw new Error("이미 존재하는 카테고리 이름입니다");
    }
    if (checkIndex) {
      throw new Error("이미 존재하는 카테고리 인덱스입니다");
    }
    // 새로운 카테고리 생성, name:name. items:위에서 만든 arr
    const newCategory = await Category.create({
      name,
      index,
      items: arr,
    });
    return newCategory;
  }

  // ***************************** 여기가 업뎃입니다 형석님 *******************************
  async updateCategory(data) {
    const { name, index, currentName } = data;

    // 기존 카테고리 이름으로 찾은후 업데이트
    const fixedCategory = await Category.updateOne(
      { name: currentName },
      {
        name,
        index,
      }
    );
    // 해당 카테고리에 속해있던 items 의 카테고리 변경

    await Item.updateMany(
      { category: currentName },
      {
        category: name,
      }
    );

    console.log("리턴");
    return fixedCategory;
  }

  //해당 카테고리 아이템 조회
  async categoriesItems(data) {
    console.log("카테고리 하나 조회 비즈니스로직 진입");
    const { name, index, page, perPage } = data;
    console.log("비즈니스로직에서 콘솔 : " + name, index, page, perPage);
    const result = await Category.findOne({
      name,
      index,
    })
      .populate("items")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage);

    const total = result.items.length;
    const totalPage = Math.ceil(total / perPage);
    let resultArr = [];
    for (let i = 0; i < result.items.length; i++) {
      let obj = {};
      obj = result.items[i];
      resultArr.push(obj);
    }
    // console.log(resultArr);
    return { resultArr, totalPage };
  }

  //해당 카테고리 삭제하고 카테고리에 속해있던 아이템의 카테고리속성 ""로 만듬
  async deleteCategory(data) {
    const { index, name } = data;

    const deleteCategory = await Category.deleteOne({ index: index });
    // 아래 코드는 리뷰때
    // const changeItemCategoryName = await Item.updateMany(
    //   { category: name },
    //   { category: "" }
    // );
    return deleteCategory;
  }
}

const categoryService = new CategoryService();

export { categoryService };
