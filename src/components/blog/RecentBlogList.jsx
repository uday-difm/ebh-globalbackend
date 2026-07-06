"use client";

import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import BlogCard from './BlogCard';

export default function RecentBlogList({ blogs }) {
    const [currentPage, setCurrentPage] = useState(0);
    const blogsPerPage = 12;

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const offset = currentPage * blogsPerPage;
    const currentBlogs = blogs.slice(offset, offset + blogsPerPage);
    const pageCount = Math.ceil(blogs.length / blogsPerPage);

    return (
        <>
            <div className='relative h-[26rem]  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                {currentBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
            
            <div id="react-paginate" className="my-10">
                 <ReactPaginate
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                 />
            </div>
        </>
    );
}