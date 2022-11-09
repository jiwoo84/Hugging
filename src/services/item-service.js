import { Category, Coupon, Item, User } from "../db";
import fs from "fs";
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
      .limit(9);
    const newItems = await Item.find({ onSale: true })
      .sort({ createdAt: -1 })
      .limit(3);
    // console.log(bestItems, newItems);
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
      const result = "정상적으로 삭제 되었습니다.";
      return result;
    } else {
      // 만약 판매량이 0이 아니라면 onSale을 false로 변경, (구매목록에서의 삭제를 방지)
      await Item.findByIdAndUpdate({ _id: deleteId }, { onSale: false });
      const result = "구매자가 존재해 숨김처리 되었습니다.";
      return result;
    }
  }

  //상품 수정
  async updateItem(findItemId, toUpdate, fixImgUrl) {
    console.log("업데이트 요구사항 : ", toUpdate);
    // 문제상황 카테고리 변경시
    const beforeItem = await Item.findById(findItemId);
    const pullFromCategory = await Category.findOneAndUpdate(
      {
        name: beforeItem.category,
      },
      { $pull: { items: beforeItem._id } }
    );
    console.log("헌 카테고리 빼기 ", pullFromCategory);
    // const categories = await Category.findOneAndUpdate({ name: category });
    // const categoryName = categories.reduce((a, c) => {
    //   a.push(c.name);
    //   return a;
    // }, []);
    // console.log("카테고리네임 : ", categoryName);
    //카테고리입력값이 변경되었고, 그게 유효하다면
    // }
    // console.log("이게?", item);
    // itme.updateOne(toUpdate);
    // itme.save();

    await Item.findByIdAndUpdate(findItemId, toUpdate);
    if (fixImgUrl) {
      await Item.findByIdAndUpdate(findItemId, { imageUrl: fixImgUrl });
    }
    const afterItem = await Item.findById(findItemId);
    const putToCategory = await Category.findOneAndUpdate(
      { name: afterItem.category },
      { $push: { items: afterItem._id } }
    );
    console.log("새 카테고리 넣기 ", putToCategory);
    // console.log(await Item.findById(findItemId));
    return;
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
  async paginationItems(data) {
    const page = data.page;
    const perPage = data.perPage;

    console.log("페이지네이션 서비스 로직");
    const total = await Item.countDocuments({});
    const items = await Item.find({})
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage);

    const totalPage = Math.ceil(total / perPage);
    console.log(items);
    // console.log(`1.${total}\n2.${items}\n3.${totalPage}`);
    return { page, perPage, items, totalPage };
  }
}

const itemService = new ItemService();

export { itemService };
