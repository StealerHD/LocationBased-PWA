import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WikipediaEntry = ({ searchTerm }) => {
    const [content, setContent] = useState(null);
    const [image, setImage] = useState(null);
    console.log(searchTerm)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`
                );
                const data = response.data;
                
                if (response.status == 200) {
                    // Überprüfen, ob ein Bild vorhanden ist
                    if (data.originalimage && data.originalimage.source) {
                        setImage(data.originalimage.source);
                    }
                    // Extrahiere den relevanten Inhalt
                    setContent(data.extract);
                } else {
                    setContent("No Wiki entry found!")
                }
            } catch (error) {
                console.error('Fehler beim Abrufen des Wikipedia-Eintrags:', error);
            }
        };

        fetchData();
    }, [searchTerm]);

    return (
        <div>
            {content && <p>{content}</p>}
            {image && <img src={image} alt="Wikipedia-Bild" style={{ maxWidth: "100%"}}/>}
        </div>
    );
};

export default WikipediaEntry;
