import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { WikipediaResponse } from '../js/WikipediaResponse ';

interface WikipediaEntryProps {
    searchTerm: string | null;
}

const WikipediaEntry: React.FC<WikipediaEntryProps> = ({ searchTerm }) => {
    const [content, setContent] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    useQuery<WikipediaResponse, AxiosError>({
        queryKey: ['wikiData', searchTerm],
        queryFn: async () => {
            const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`);
            return data as WikipediaResponse;
        },
        enabled: !!searchTerm,
        retry: false,
        onSuccess: (data: WikipediaResponse) => {
            const { originalimage, extract } = data;

            if (originalimage && originalimage.source) {
                const { source } = originalimage;
                setImage(source);
            }

            if (extract) {
                setContent(extract);
            }
        },
        onError: (error: AxiosError) => {
            console.error('Fehler beim Abrufen des Wikipedia-Eintrags:', error);
            setContent("No Wiki entry found!")
            setImage(null);
        },
    });

    return (
        <div>
            {content && <p>{content}</p>}
            {image && <img src={image} alt="Wikipedia-Bild" style={{ maxWidth: "100%" }} loading="lazy" />}
        </div>
    );
};

export default WikipediaEntry;
