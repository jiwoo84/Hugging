import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category, Item } from "../db";
class ItemService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}

  // 상품 추가 서비스
  async addItem(data) {
    const { category } = data;
    const isCategory = await Category.findOne({ name: category });
    if (!isCategory) {
      throw new Error("해당 카테고리는 없습니다.");
    }

    // 중복된 상품이름인지 확인
    const overlapName = await Item.findOne({ name: data.name });
    if (overlapName) {
      throw new Error("해당이름으로 상품을 추가할수 없습니다.");
    }

    // 아래는 생성
    const newItem = await Item.create(data);

    //아래는 카테고리 업데이트
    await Category.updateOne(
      { name: category },
      { $push: { items: newItem._id } }
    );
    return newItem;
  }

  // 관리자페이지에서 items CRUD 에 필요한 함수
  async adminFindItems() {
    const items = await Item.find({});
    return items;
  }

  // newItems와 bestItems 를 리턴하는 함수
  async homeFindItems() {
    const bestItems = await Item.find({ onSale: true })
      .sort({ sales: -1 })
      .limit(8);
    const newItems = await Item.find({ onSale: true })
      .sort({ createdAt: -1 })
      .limit(3);
    return { newItems, bestItems };
  }

  // 상품상세페이지를 위한 데이터 리턴
  async detailViewItem(findId) {
    //id값을 받아 해당 id의 아이템 정보 리턴
    const findItem = await Item.findById({ _id: findId });
    return findItem;
  }

  //상품 지우거나 숨김 처리
  async deleteItem(deleteId) {
    const findId = await Item.findById(deleteId);

    if (findId.sales === 0) {
      // 만약 판매량이 0이라면, 해당 제품은 삭제
      await Item.findByIdAndDelete({ _id: deleteId });
      console.log("아이템삭제 : 아이템삭제완료");

      //카테고리에서도 수정해야함
      await Category.updateMany(
        { name: findId.category },
        { $pull: { items: deleteId } }
      );
      console.log("아이템삭제 : 카테고리수정도 완료");
      return "정상적으로 삭제 되었습니다.";
    } else {
      // 만약 판매량이 0이 아니라면 onSale을 false로 변경, (구매목록에서의 삭제를 방지)
      await Item.findByIdAndUpdate({ _id: deleteId }, { onSale: false });
      return "구매자가 존재해 숨김처리 되었습니다.";
    }
  }

  //상품 수정
  async updateItem(findItemId, toUpdate) {
    return await Item.updateMany({ _id: findItemId }, toUpdate);
  }

  // 카테고리 포함되어있지 않은 아이템들 소환
  async noAffiliation() {
    const categories = await Category.find({});
    const items = await Item.find({});
    // let isCategory = [];
    // for (let i = 0; i < categories.length; i++) {
    //   isCategory.push(categories[i].name);
    // }
    // console.log(categories);
    const isCategory = categories.reduce((ac, category) => {
      ac.push(category.name);
      return ac;
    }, []);
    console.log(isCategory);

    const noAffiliation = items.filter(
      (item) => !isCategory.includes(item.category)
    );
    console.log(items.length);
    console.log(noAffiliation.length);
    return noAffiliation;
  }

  async searchItems(word) {
    console.log("들어옴");
    const reward = await Item.find({ name: { $regex: word, $options: "i" } });
    if (!reward) {
      return null;
    }
    return reward;
  }
}

const itemService = new ItemService();

export { itemService };
