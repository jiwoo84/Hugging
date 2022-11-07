import { Comment, Item, User } from "../db";
class CommentService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}

  // 리뷰추가
  async addComment(text, itemId, _id) {
    const user = await User.findById(_id);
    const item = await Item.findById(itemId);

    // 리뷰등록 제한
    if (item.comments.includes(itemId)) {
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
    return newComment;
  }
}

const commentService = new CommentService();

export { commentService };
