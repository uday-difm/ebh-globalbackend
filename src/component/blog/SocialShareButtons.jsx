"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faLinkedin, faPinterest, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, WhatsappShareButton } from "react-share";

export default function SocialShareButtons({ title }) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    if (!url) return null;

    const buttonClass = "w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-300";

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold mr-2">Share:</span>
            <FacebookShareButton url={url} title={title} className={buttonClass}>
                <FontAwesomeIcon icon={faFacebookF} />
            </FacebookShareButton>
            <PinterestShareButton url={url} media={title} description={title} className={buttonClass}>
                 <FontAwesomeIcon icon={faPinterest} />
            </PinterestShareButton>
            <LinkedinShareButton url={url} title={title} className={buttonClass}>
                 <FontAwesomeIcon icon={faLinkedin} />
            </LinkedinShareButton>
            <WhatsappShareButton url={url} title={title} className={buttonClass}>
                 <FontAwesomeIcon icon={faWhatsapp} />
            </WhatsappShareButton>
        </div>
    );
}