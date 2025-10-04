import AtticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";

const BlogPage = () => {
    return (
        <>
            <Header />
            <main className="mt-25 font-serif">
                <div>
                    <h1 className="text-6xl font-bold px-10 p-2">Article</h1>
                </div>
                <div className="p-6">
                    <AtticleCard/>
                </div>
            </main>
        </>
    )
}

export default BlogPage;