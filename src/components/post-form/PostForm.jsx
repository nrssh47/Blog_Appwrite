import React, { useCallback,useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [previewImage, setPreviewImage] = useState(null);


    const submit = async (data) => {
    let fileId = post?.featuredimage; // Keep existing image if no new file is uploaded

    try {
        // Upload new image if provided
        if (data.image && data.image.length > 0) {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file && file.$id) {
                // Delete old image if editing post
                if (post && post.featuredimage) {
                    await appwriteService.deleteFile(post.featuredimage);
                }

                fileId = file.$id;
            } else {
                console.error("File upload failed.");
                return;
            }
        }

        const postData = { ...data, featuredimage: fileId };

        // Create or update post
        const dbPost = post
            ? await appwriteService.updatePost(post.$id, postData)
            : await appwriteService.createPost({ ...postData, userId: userData.$id });

        // Navigate on success
        if (dbPost && dbPost.$id) {
            navigate(`/post/${dbPost.$id}`);
        } else {
            console.error("Post creation/updating failed.");
        }

    } catch (error) {
        console.error("Error during post submit:", error);
    }
};


    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
  label="Featured Image :"
  type="file"
  className="mb-4"
  accept="image/png, image/jpg, image/jpeg, image/gif"
  {...register("image", { required: !post })}
  onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
          setPreviewImage(URL.createObjectURL(file));
      }
  }}
/>

                {(previewImage || post?.featuredimage) && (
  <div className="w-full mb-4">
    <img
      src={
        previewImage
          ? previewImage
          : appwriteService.getFilePreview(
              typeof post.featuredimage === "object"
                ? post.featuredimage?.$id
                : post.featuredimage
            )
      }
      alt="Featured preview"
      className="rounded-lg border border-red-500"
    />
  </div>
)}

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}