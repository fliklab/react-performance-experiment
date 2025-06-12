export interface CommentItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Comment author information */
  author: {
    name: string;
    avatar?: string;
  };
  /** Comment content */
  content: string;
  /** Timestamp string */
  timestamp: string;
  /** Number of likes */
  likes?: number;
  /** Number of replies */
  replies?: number;
  /** Whether current user liked this comment */
  isLiked?: boolean;
  /** Callback for like action */
  onLike?: () => void;
  /** Callback for reply action */
  onReply?: () => void;
  /** Callback for edit action */
  onEdit?: () => void;
  /** Callback for delete action */
  onDelete?: () => void;
  /** Whether current user can edit */
  canEdit?: boolean;
  /** Whether current user can delete */
  canDelete?: boolean;
  /** Additional CSS classes */
  className?: string;
}
