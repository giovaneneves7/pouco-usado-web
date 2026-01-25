"use client";
import { sendMessageApi } from "@/utils/api";
import { useEffect, useState, useRef } from "react";
import { IoMdAttach, IoMdSend } from "react-icons/io";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { t } from "@/utils";
import CustomImage from "@/components/Common/CustomImage";

const SendMessage = ({ selectedChatDetails, setChatMessages }) => {
  const isAllowToChat =
    selectedChatDetails?.item?.status === "approved" ||
    selectedChatDetails?.item?.status === "featured";

  if (!isAllowToChat) {
    return (
      <div className="p-4 border-t text-center text-muted-foreground">
        {t("thisAd")} {selectedChatDetails?.item?.status}
      </div>
    );
  }

  const id = selectedChatDetails?.id;
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG, JPG) are allowed");
      return;
    }

    // Create preview URL for image
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedFile) || isSending) return;

    const params = {
      item_offer_id: id,
      message: message ? message : "",
      file: selectedFile ? selectedFile : "",
      audio: "", 
    };

    try {
      setIsSending(true);
      const response = await sendMessageApi.sendMessage(params);

      if (!response?.data?.error) {
        setChatMessages((prev) => [...prev, response.data.data]);
        setMessage("");
        removeSelectedFile();
      } else {
        toast.error(response?.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* File Preview */}
      {previewUrl && (
        <div className="px-4 pt-2 pb-1">
          <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
            <CustomImage
              src={previewUrl}
              alt="File preview"
              fill
              className="object-contain"
            />
            <button
              onClick={removeSelectedFile}
              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileSelect}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          aria-label="Attach file"
        >
          <IoMdAttach size={20} className="text-muted-foreground" />
        </button>

        <textarea
          type="text"
          placeholder="Message..."
          className="flex-1 outline-none border px-3 py-1 rounded-md resize-none"
          value={message}
          rows={2}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          className="p-2 bg-primary text-white rounded-md disabled:opacity-50"
          disabled={isSending || (!message.trim() && !selectedFile)}
          onClick={() => sendMessage()}
        >
          {isSending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <IoMdSend size={20} className="rtl:scale-x-[-1]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SendMessage;