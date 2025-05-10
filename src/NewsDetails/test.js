        //  <div className="related-news">
        //       <h3
        //         className="related-news-title"
        //         style={savedLang?.code === `ar` ? headerArStyle : headerEnStyle}
        //       >
        //         {t("details.latest")}
        //       </h3>

        //       <div className="news-grid">
        //         {filteredNews.slice(0, 6).map((news, index) => (
        //           <Link
        //             to={`/details`}
        //             state={{ news: news }}
        //             onClick={() => {
        //               window.scrollTo(0, 0);
        //               setCurrentNews(news);
        //             }}
        //             className="about-news"
        //             key={index}
        //           >
        //             <div className="news-details-card">
        //               <img
        //                 src={news.image}
        //                 alt={`News ${index}`}
        //                 className={
        //                   savedLang?.code === `ar`
        //                     ? "news-imagear"
        //                     : "news-image"
        //                 }
        //               />
        //               <div className="news-content">
        //                 <h4
        //                   style={savedLang?.code === `ar` ? pArStyle : pEnStyle}
        //                 >
        //                   {news.header[0].slice(0, 100)}...
        //                 </h4>
        //                 <p
        //                   style={savedLang?.code === `ar` ? pArStyle : pEnStyle}
        //                 >
        //                   {news.date && formatDate(news.date)}
        //                 </p>
        //               </div>
        //             </div>
        //           </Link>
        //         ))}
        //       </div>
        //     </div>