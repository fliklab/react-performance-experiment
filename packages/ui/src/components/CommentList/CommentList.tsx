import React from "react";
import { cn } from "../../utils/cn";
import { CommentItem } from "../CommentItem";
import { Button } from "../Button";
import { Spinner } from "../Spinner";
import { Icon } from "../Icon";
import { CommentListProps } from "./types";

const CommentList: React.FC<CommentListProps> = ({
  comments = [],
  loading = false,
  loadingMore = false,
  hasMore = false,
  totalCount = 0,
  sortBy = "newest",
  sortOptions = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "likes", label: "좋아요순" },
  ],
  onSortChange,
  onLoadMore,
  onCommentLike,
  onCommentReply,
  onCommentEdit,
  onCommentDelete,
  className,
  ...props
}) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          댓글{" "}
          {totalCount > 0 && (
            <span className="text-gray-500">({totalCount})</span>
          )}
        </h3>

        {sortOptions.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Comments */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="large" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="user" size="xl" className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            아직 댓글이 없습니다
          </p>
          <p className="text-gray-500">첫 번째 댓글을 남겨보세요!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              author={comment.author}
              content={comment.content}
              timestamp={comment.timestamp}
              likes={comment.likes}
              replies={comment.replies}
              isLiked={comment.isLiked}
              canEdit={comment.canEdit}
              canDelete={comment.canDelete}
              onLike={() => onCommentLike?.(comment.id)}
              onReply={() => onCommentReply?.(comment.id)}
              onEdit={() => onCommentEdit?.(comment.id)}
              onDelete={() => onCommentDelete?.(comment.id)}
            />
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              {loadingMore ? (
                <Spinner size="medium" />
              ) : (
                <Button variant="outline" onClick={onLoadMore} className="px-8">
                  더 많은 댓글 보기
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CommentList.displayName = "CommentList";

export { CommentList };
