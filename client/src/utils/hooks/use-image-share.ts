import toast from "react-hot-toast";

export default function useImageShare() {
  const onClick = async (title: string, imageUrl: string) => {
    try {
      const imageResponse = await fetch(imageUrl);
      const imageData = await imageResponse.blob();
      const metadata = {
        type: "type/jpeg",
      };
      const imageFile = new File(
        [imageData],
        "artificial_unintelligence_img.jpg",
        metadata
      );

      if (navigator.canShare({ files: [imageFile] })) {
        navigator
          .share({
            title: title,
            files: [imageFile],
          })
          .then(() => {
            console.log(`Thanks for sharing!`);
          })
          .catch(console.error);
      }
    } catch (error) {
      toast.error("Oops, looks like we can't download this image.");
    }
  };

  return {
    onClick,
  };
}
