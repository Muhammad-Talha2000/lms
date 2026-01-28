import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  User,
  Trash2,
} from "lucide-react";
import {
  getDiscussions,
  createDiscussion,
  addReply,
  toggleLike,
  deleteDiscussion,
} from "@/services/discussionService";
import { useSelector } from "react-redux";

const DiscussionBox = ({ courseId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newPost, setNewPost] = useState({
    module: "",
    title: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [activeReplyDiscussion, setActiveReplyDiscussion] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [discussionIdToDelete, setDiscussionIdToDelete] = useState(null);
  const { loggedinUser } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const data = await getDiscussions(courseId, loggedinUser.token);
      setDiscussions(data);
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.module || !newPost.title || !newPost.description) {
      alert("All fields are required.");
      return;
    }

    try {
      const newDiscussion = await createDiscussion(
        courseId,
        newPost,
        loggedinUser.token
      );

      setDiscussions([newDiscussion, ...discussions]);
      setNewPost({ module: "", title: "", description: "" });
      setIsDialogOpen(false);

      // Fetch fresh discussions data
      await fetchDiscussions();
    } catch (error) {
      console.error("Error creating discussion:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteDiscussion(
        courseId,
        discussionIdToDelete,
        loggedinUser.token
      );
      setDiscussions(discussions.filter((d) => d._id !== discussionIdToDelete));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting discussion:", error);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleLike = async (discussionId) => {
    try {
      const response = await toggleLike(
        courseId,
        discussionId,
        loggedinUser.token
      );
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === discussionId
            ? { ...d, likedBy: [...d.likedBy], likes: response.likes }
            : d
        )
      );
    } catch (error) {
      console.error("Error liking discussion:", error);
    }
  };

  const handleReply = async (discussionId) => {
    if (!replyContent.trim()) {
      alert("Reply content cannot be empty.");
      return;
    }

    try {
      await addReply(courseId, discussionId, replyContent, loggedinUser.token);

      // Reset reply state
      setReplyContent("");
      setActiveReplyDiscussion(null);

      // Keep the replies expanded
      setExpandedReplies((prev) => ({
        ...prev,
        [discussionId]: true,
      }));

      // Fetch fresh discussions data
      await fetchDiscussions();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const toggleRepliesExpansion = (discussionId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const toggleReplyInput = (discussionId) => {
    setActiveReplyDiscussion(
      activeReplyDiscussion === discussionId ? null : discussionId
    );
  };

  const renderDiscussionCard = (discussion) => (
    <Card
      key={discussion._id}
      className="mb-4 border-orange-100 hover:border-orange-200 transition-colors"
    >
      <CardContent className="p-6">
        {/* Author Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <User className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-semibold text-orange-500">
              {discussion.author?.role === "instructor"
                ? discussion.author.name
                : discussion.author.role}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(discussion.createdAt).toLocaleString()}
            </span>
          </div>
          {discussion.author?._id === loggedinUser.user._id && (
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDiscussionIdToDelete(discussion._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your post and all its replies.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeletePost}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Module and Title */}
        <div className="mb-3">
          <h3 className="text-md font-bold text-gray-500">
            <span className="text-gray-500">{discussion.module}</span> -{" "}
            {discussion.title}
          </h3>
        </div>

        {/* Content */}
        <p className="mb-4 text-gray-700">{discussion.description}</p>

        {/* Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <div
            className={`flex items-center cursor-pointer space-x-1 ${
              discussion.likedBy?.includes(loggedinUser.user._id)
                ? "text-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
            onClick={() => handleLike(discussion._id)}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{discussion.likes || 0} Likes</span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="flex items-center cursor-pointer hover:text-orange-500"
              onClick={() => toggleRepliesExpansion(discussion._id)}
            >
              {expandedReplies[discussion._id] ? (
                <ChevronUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              <MessageSquare className="w-4 h-4" />
              <span className="ml-1">
                {discussion.replies?.length || 0} Replies
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReplyInput(discussion._id)}
              className="text-xs hover:text-orange-500 hover:bg-orange-50"
            >
              Add Reply
            </Button>
          </div>
        </div>

        {/* Replies Section */}
        {expandedReplies[discussion._id] && discussion.replies && (
          <div className="mt-4 pl-4 border-l-2 border-orange-200">
            {discussion.replies.map((reply, index) => (
              <div
                key={index}
                className="mb-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="font-semibold text-sm text-orange-700 mr-2">
                    {reply.author?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm pl-6">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reply Input */}
        {activeReplyDiscussion === discussion._id && (
          <div className="mt-4">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-2 border-orange-200 focus:border-orange-500"
            />
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => handleReply(discussion._id)}
            >
              Reply
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const myDiscussions = discussions.filter(
    (discussion) => discussion.author?._id === loggedinUser.user._id
  );

  return (
    <div className="p-6 bg-orange-50 min-h-full overflow-y-scroll no-scrollbar ">
      <Tabs defaultValue="all-posts">
        <TabsList className="mb-6 bg-orange-100 p-1">
          <TabsTrigger
            value="all-posts"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            All Posts
          </TabsTrigger>
          <TabsTrigger
            value="my-posts"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            My Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-posts">
          <div className="flex justify-end items-center mb-6">
            {/* <Input
              type="text"
              placeholder="Search forum"
              className="w-1/2 mr-4 border-orange-200 focus:border-orange-500"
            /> */}
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              Create Post
            </Button>
          </div>
          {discussions.map(renderDiscussionCard)}
        </TabsContent>

        <TabsContent value="my-posts">
          <div className="flex justify-end items-center mb-6">
            {/* <Input
              type="text"
              placeholder="Search my posts"
              className="w-1/2 mr-4 border-orange-200 focus:border-orange-500"
            /> */}
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              Create Post
            </Button>
          </div>
          {myDiscussions.map(renderDiscussionCard)}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange-500">
              Create a New Discussion
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              type="text"
              placeholder="Module Name"
              value={newPost.module}
              onChange={(e) =>
                setNewPost({ ...newPost, module: e.target.value })
              }
              className="border-orange-200 focus:border-orange-500"
            />
            <Input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="border-orange-200 focus:border-orange-500"
            />
            <Textarea
              placeholder="Description"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
              className="border-orange-200 focus:border-orange-500"
            />
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white w-full"
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscussionBox;
