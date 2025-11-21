import { User } from "lucide-react"

export const BlogPostCard = ({
  navigate,
  image,
  node,
}: {
  navigate: any
  image: string
  node: any
}) => {
  return (
    <div
      className="rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 text-neutral-900 dark:text-neutral-300"
      onClick={navigate}
    >
      <div className="relative w-full h-44 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
        {image ? (
          <>
            <img
              src={image}
              alt="Video Thumbnail"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
              12:34
            </span>
          </>
        ) : (
          <h3 className="text-center text-sm font-semibold px-4">
            {node.title}
          </h3>
        )}
      </div>
      <div className="flex p-4 bg-neutral-100 dark:bg-[#2e2e2e]">
        <div className="w-10 h-10 mr-2 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-neutral-900" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold line-clamp-2">{node.title}</h3>
          <p className="text-xs mt-0.5">Sankar Boro</p>
          <p className="text-xs">0 views • {node.created_at}</p>
        </div>
      </div>
    </div>
  )
}
