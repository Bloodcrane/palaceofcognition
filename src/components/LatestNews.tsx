import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LatestNewsProps {
    imageUrl: string;
    title: string;
    description: string;
    articleId?: string;
}

const LatestNewsComponent: React.FC<LatestNewsProps> = ({ imageUrl, title, description, articleId }) => {
    const cardContent = (
        <div className="latestNews">
            <div style={{ position: 'relative', gridRow: '1 / 5', gridColumn: '1' }}>
                <Image 
                    src={imageUrl} 
                    className="webComponent-bg-img" 
                    alt="" 
                    fill
                    sizes="480px"
                    style={{ objectFit: 'cover', opacity: 0.4, filter: 'blur(8px)' }}
                />
            </div>
            <div className="webComponent-overlay">
                <h1 className="webComponent-title">{title}</h1>
                <label className="webComponent-description">{description}</label>
            </div>
            <div style={{ position: 'relative', gridRow: '2', gridColumn: '1', width: '100%', height: '250px' }}>
                <Image 
                    src={imageUrl} 
                    className="webComponent-img" 
                    alt={title} 
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <div className="compact-button-row">
                <span className="compact-button">🗞️ ნახვა</span>
            </div>
        </div>
    );

    if (articleId) {
        return (
            <Link href={`/article/${articleId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}

export default LatestNewsComponent;
