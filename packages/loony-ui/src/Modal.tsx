export const Modal = ({ children }: any) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg w-full max-w-sm p-6">
        {children}
      </div>
    </div>
  )
}
