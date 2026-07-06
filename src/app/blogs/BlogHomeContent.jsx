"use client";

import { useEffect, useState } from "react";
import "../pagination.css";
import dynamic from "next/dynamic";
import PaginatedBlogList from "../../components/PaginatedBlogList";

const CategorySlider = dynamic(() => import("../../components/CategorySlider"), {
	ssr: false,
});

export default function BlogHomeContent({ blogs = [], categories = [] }) {
	const [clientBlogs, setClientBlogs] = useState(Array.isArray(blogs) ? blogs : []);
	const [clientCategories, setClientCategories] = useState(Array.isArray(categories) ? categories : []);

	useEffect(() => {
		if (Array.isArray(blogs) && blogs.length) {
			setClientBlogs(blogs);
		}
	}, [blogs]);

	useEffect(() => {
		if (Array.isArray(categories) && categories.length) {
			setClientCategories(categories);
		}
	}, [categories]);

	useEffect(() => {
		const shouldHydrateBlogs = !clientBlogs.length;
		const shouldHydrateCategories = !clientCategories.length;

		if (!shouldHydrateBlogs && !shouldHydrateCategories) return;

		const fetchClientData = async () => {
			try {
				if (shouldHydrateBlogs) {
					const res = await fetch('/api/blogs?page=1&limit=50', { cache: 'no-store' });
					if (res.ok) {
						const json = await res.json();
						if (Array.isArray(json?.blogs)) {
							setClientBlogs(json.blogs);
							if (!shouldHydrateCategories && !clientCategories.length && Array.isArray(json?.categories)) {
								setClientCategories(json.categories);
							}
						}
					}
				}

				if (shouldHydrateCategories) {
					const res = await fetch('/api/categoriesHome', { cache: 'no-store' });
					if (res.ok) {
						const json = await res.json();
						if (Array.isArray(json?.categories)) {
							setClientCategories(json.categories);
						}
					}
				}
			} catch (error) {
				console.error('Client hydration for blogs page failed', error);
			}
		};

		fetchClientData();
	}, [clientBlogs.length, clientCategories.length, blogs, categories]);

	const publishedBlogs = Array.isArray(clientBlogs)
		? clientBlogs.filter((blog) => String(blog?.status ?? '1') === '1')
		: [];
	const activeCategories = Array.isArray(clientCategories) ? clientCategories : [];

	return (
		<div className="relative dark:bg-white!">
			<main className="pt-20 sm:pt-10 text-black mt-20">
				<div className="container mx-auto px-4 max-w-[1350px]">
					<div className="my-8">
						<CategorySlider categories={activeCategories} />
					</div>

					<div className="text-center col-span-2 flex flex-col gap-2 mb-6">
						<h2 className="text-4xl font-bold" itemProp="headline">
							Most Recent Blogs
						</h2>
						<p className="text-xl mb-16">
							Uncover the most popular reads across various life categories
						</p>
					</div>

					{publishedBlogs.length > 0 ? (
						<PaginatedBlogList blogs={publishedBlogs} isAnimationEnabled={true} />
					) : (
						<div className="py-16 text-center text-lg text-gray-500">
							Fresh stories are on the way. Please check back shortly.
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
