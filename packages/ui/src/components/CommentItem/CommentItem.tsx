import React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { CommentItemProps } from "./types";

const CommentItem: React.FC<CommentItemProps> = ({
  author,
  content,
  timestamp,
  likes = 0,
  replies = 0,
  isLiked = false,
  onLike,
  onReply,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex space-x-3", className)} {...props}>
      <Avatar src={author.avatar} alt={author.name} size="medium" />

      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900">{author.name}</h4>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
          <p className="text-sm text-gray-700">{content}</p>
        </div>

        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={onLike}
            className={cn(
              "flex items-center space-x-1 text-sm",
              isLiked ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon name="heart" size="small" />
            <span>{likes}</span>
          </button>

          <button
            onClick={onReply}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <span>답글</span>
            {replies > 0 && <span>({replies})</span>}
          </button>

          {canEdit && (
            <button
              onClick={onEdit}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              수정
            </button>
          )}

          {canDelete && (
            <button
              onClick={onDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CommentItem.displayName = "CommentItem";

export { CommentItem };
