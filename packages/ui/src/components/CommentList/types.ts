import { CommentItemProps } from "../CommentItem/types";

export interface Comment
  extends Omit<
    CommentItemProps,
    "onLike" | "onReply" | "onEdit" | "onDelete" | "className"
  > {
  id: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface CommentListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of comments to display */
  comments?: Comment[];
  /** Whether data is loading */
  loading?: boolean;
  /** Whether more data is loading */
  loadingMore?: boolean;
  /** Whether there are more comments to load */
  hasMore?: boolean;
  /** Total comment count */
  totalCount?: number;
  /** Current sort value */
  sortBy?: string;
  /** Available sort options */
  sortOptions?: SortOption[];
  /** Sort change callback */
  onSortChange?: (sortValue: string) => void;
  /** Load more callback */
  onLoadMore?: () => void;
  /** Comment like callback */
  onCommentLike?: (commentId: string) => void;
  /** Comment reply callback */
  onCommentReply?: (commentId: string) => void;
  /** Comment edit callback */
  onCommentEdit?: (commentId: string) => void;
  /** Comment delete callback */
  onCommentDelete?: (commentId: string) => void;
  /** Additional CSS classes */
  className?: string;
}
