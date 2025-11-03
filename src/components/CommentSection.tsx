import React, { useState } from "react";
import Image from "next/image";

export interface Comment {
  id: string;
  description: string;
  user: {
    username: string;
    avatar?: string;
  };
  userId?: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onPublish: (text: string) => void;
  currentUser?: {
    username: string;
    avatar?: string;
    id?: string;
  };
  onDelete?: (id: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onPublish, currentUser, onDelete }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await onPublish(text);
    setText("");
    setLoading(false);
  };

  return (
  <div className="w-full max-w-4xl mx-auto mt-10 flex flex-col items-start px-2 md:px-0">
      <div className="mb-8 w-full">
        <h2 className="text-4xl font-extrabold text-black pb-3 border-b-4 border-black w-full text-left">
          Commentaires
          <span className="ml-2 text-xl font-bold text-neutral-500 align-middle">{comments.length}</span>
        </h2>
      </div>
      {currentUser?.id ? (
        <div className="flex items-start gap-4 mb-6 w-full">
          <Image
            src={currentUser?.avatar || "/uploads/user-default.jpg"}
            alt={currentUser?.username || "Utilisateur"}
            width={48}
            height={48}
            className="rounded-full border border-neutral-300"
          />
          <div className="flex-1">
            <textarea
              className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-blue-400 resize-none text-lg"
              rows={3}
              placeholder="Écrire un commentaire..."
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePublish}
                disabled={loading || !text.trim()}
                className="bg-black hover:bg-neutral-800 text-white font-bold py-2 px-6 rounded-none transition-all duration-150 disabled:opacity-50"
              >
                {loading ? "Publication..." : "Publier"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mb-6 text-neutral-500 text-center text-lg">Connectez-vous pour publier un commentaire.</div>
      )}
  <div className="space-y-6 w-full">
        {comments.length === 0 && (
          <div className="text-neutral-500 text-center">Aucun commentaire pour l'instant.</div>
        )}
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start gap-4 p-4 rounded-xl">
            <Image
              src={comment.user.avatar || "/uploads/user-default.jpg"}
              alt={comment.user.username}
              width={40}
              height={40}
              className="rounded-full border border-neutral-300"
            />
            <div className="flex-1">
              <div className="font-semibold text-blue-700 flex items-center gap-2">
                {comment.user.username}
                {currentUser?.id && comment.userId === currentUser.id && (
                  <button
                    onClick={() => onDelete && onDelete(comment.id)}
                    className="ml-2 text-xs text-red-600 border border-red-300 rounded px-2 py-1 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <div className="text-neutral-800 mt-1 text-base whitespace-pre-line">{comment.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
