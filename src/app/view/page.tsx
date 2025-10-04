import Header from "@/components/Header";
import Home from "../home/page";
import BlogPage from "../articles/page";

const View = () => {
    return (
        <div className="p-8">
            <Header />
            <Home />
            <BlogPage />
        </div>
    )
}

export default View;