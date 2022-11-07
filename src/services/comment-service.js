import { Comment, Item, User } from "../db";
class CommentService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}

  // 리뷰추가
  async addComment(text, itemId, _id) {
    const user = await User.findById(_id);
    const item = await Item.findById(itemId);
    // 리뷰등록 제한
    if (user.ownComments.includes(itemId)) {
      throw new Error("리뷰는 한번만 등록할 수 있습니다.");
    }

    //댓글 생성
    const newComment = await Comment.create({
      text,
      affiliation: itemId,
      owner: _id,
    });
    // 해당 아이템DB에 생성된 댓글 id 넘기고 저장
    item.comments.push(newComment._id);
    item.save();
    // 중복리뷰를 막기위해 유저 리뷰배열에 저장
    user.ownComments.push(itemId);
    user.save();
    console.log(await Item.findById(itemId));
    return newComment;
  }

  // 상품에 추가된 댓글 보기
  async getAll(_id) {
    // item.commets 를 찾음
    const comments = (await Item.findById(_id).populate("comments")).comments;
    console.log("포문 돌아감@@");

    //찾은 commets가 user를 참조하기위해 for문 실행
    // 아래 빈 배열에 리턴할 내용을 추가해줄것임
    let commentOwners = [];
    for (let i = 0; i < comments.length; i++) {
      const commentData = await comments[i].populate("owner");
      const obj = {
        cmtId: comments[i]._id,
        ownId: commentData.owner._id,
        name: commentData.owner.name,
        createdAt: commentData.createdAt,
        text: commentData.text,
      };
      commentOwners.push(obj);
    }
    return commentOwners;
  }

  async deleteComment(data) {
    const { userId, itemId, commentId } = data;
    const user = await User.findById(userId);
    const item = await Item.findById(itemId);
    // 유저정보에서 리뷰 달았던 item 빼줌
    user.ownComments.pull(item._id);
    user.save();
    // 상품에서 해당 리뷰 빼줌
    item.comments.pull(commentId);
    item.save();
    // db에서 해당 리뷰 doc 제거
    const cmtId = await Comment.findByIdAndDelete(commentId);
    return cmtId;
  }

  //리뷰업뎃
  async updateCmt(userId, cmtId, fixText) {
    const user = await User.findById(userId);
    const cmt = await Comment.findById(cmtId);
    // objectID 와 비교연산자 쓰려면  JSON.stringify 로 바꿔주고 해야함
    if (JSON.stringify(cmt.owner) !== JSON.stringify(user._id)) {
      throw new Error("댓글의 주인이 아니네.. ");
    }
    cmt.text = fixText;
    cmt.save();
    return cmt;
  }
}

const commentService = new CommentService();

export { commentService };
