const Background = () => {
        return <div className="fixed -z-50 top-0 bg-slate-900 inset-x-0 min-h-full flex justify-center overflow-hidden pointer-events-none">
                <div className="w-screen flex-none flex justify-start overflow-hidden">
                        {/* Image from tailwind documentation, temporary, will replace with non copywrited img later */}
                        <picture className="w-screen h-1/5 min-h-[50vh]">
                                <img src="/background.webp" alt="" className="absolute top-1/2 translate -translate-y-1/2 -translate-x-3/4 left-1/2 flex-none max-w-none dark:block" />
                        </picture>
                </div>
        </div>;
}

export default Background;