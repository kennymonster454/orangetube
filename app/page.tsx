"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Comment = { id: number; text: string; gif?: string };
type Video = { id: number; title: string; creator: string; src: string; comments: Comment[]; local?: boolean };

const starterVideos: Video[] = [
  { id: 1, title: "Welcome to OrangeTube!", creator: "OrangeTube", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", comments: [{ id: 1, text: "The orange era begins." }] },
  { id: 2, title: "A tiny nature break", creator: "OrangeTube", src: "https://media.w3.org/2010/05/sintel/trailer.mp4", comments: [{ id: 2, text: "Nice video!" }] }
];

export default function Home() {
  const [videos, setVideos] = useState<Video[]>(starterVideos);
  const [selected, setSelected] = useState<number>(1);
  const [commentText, setCommentText] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [notice, setNotice] = useState("");

  const current = videos.find(v => v.id === selected) ?? videos[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("orangetube-demo-v1");
      if (saved) {
        const parsed = JSON.parse(saved) as Video[];
        if (Array.isArray(parsed) && parsed.length) setVideos(parsed);
      }
    } catch { /* Ignore invalid local demo data. */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("orangetube-demo-v1", JSON.stringify(videos.filter(v => !v.local))); }
    catch { /* Browser storage can be full. */ }
  }, [videos]);

  function uploadVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { setNotice("Please choose a video file."); return; }
    const url = URL.createObjectURL(file);
    const video: Video = { id: Date.now(), title: file.name.replace(/\.[^.]+$/, ""), creator: "You", src: url, comments: [], local: true };
    setVideos(old => [video, ...old]);
    setSelected(video.id);
    setNotice("Video loaded in this browser. Permanent uploads are coming in the storage update.");
    event.target.value = "";
  }

  function addComment(event: FormEvent) {
    event.preventDefault();
    if (!current || (!commentText.trim() && !gifUrl.trim())) return;
    if (gifUrl.trim() && !/^https?:\/\/.+\.gif(?:[?#].*)?$/i.test(gifUrl.trim())) {
      setNotice("GIFs only: use a direct image link ending in .gif.");
      return;
    }
    const comment: Comment = { id: Date.now(), text: commentText.trim(), ...(gifUrl.trim() ? { gif: gifUrl.trim() } : {}) };
    setVideos(old => old.map(v => v.id === current.id ? { ...v, comments: [...v.comments, comment] } : v));
    setCommentText("");
    setGifUrl("");
    setNotice("");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="OrangeTube home"><span className="brand-mark">O</span><span>orange<span className="brand-light">tube</span></span></a>
        <span className="tagline">Different color. Same internet.</span>
        <label className="upload-button">＋ Upload video<input type="file" accept="video/*" onChange={uploadVideo} /></label>
      </header>

      <section className="hero">
        <div><p className="eyebrow">WELCOME TO THE ORANGE SIDE</p><h1>Videos hit <em>different.</em></h1><p className="subhead">Watch something good. Leave a comment. Keep the GIFs in the comments.</p></div>
        <div className="orange-orb" aria-hidden="true">🍊</div>
      </section>

      {notice && <p className="notice" role="status">{notice}</p>}

      <div className="content-grid">
        <section className="watch-column">
          <div className="section-heading"><div><p className="eyebrow">NOW PLAYING</p><h2>{current?.title ?? "Pick a video"}</h2></div><span className="live-dot">ORANGE FEED</span></div>
          {current && <div className="player-wrap"><video key={current.id} className="player" src={current.src} controls playsInline /></div>}
          {current && <div className="video-meta"><div><strong>{current.creator}</strong><p>Welcome to the OrangeTube community.</p></div><span className="pill">🍊 OrangeTube</span></div>}

          <section className="comments">
            <div className="section-heading"><div><p className="eyebrow">THE CONVERSATION</p><h2>Comments <span className="count">{current?.comments.length ?? 0}</span></h2></div><span className="gif-rule">GIFs live here only</span></div>
            <form className="comment-form" onSubmit={addComment}>
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." aria-label="Comment text" />
              <input value={gifUrl} onChange={e => setGifUrl(e.target.value)} placeholder="Optional direct .gif link" aria-label="GIF link" />
              <button type="submit">Post comment</button>
            </form>
            <p className="hint">GIF rule: GIF links are accepted in comments only. No GIF video uploads or thumbnails.</p>
            <div className="comment-list">
              {current?.comments.map(comment => <article className="comment" key={comment.id}><div className="avatar">{comment.text ? comment.text[0].toUpperCase() : "G"}</div><div><strong>Orange viewer</strong>{comment.text && <p>{comment.text}</p>}{comment.gif && <img className="comment-gif" src={comment.gif} alt="GIF in comment" />}</div></article>)}
              {current?.comments.length === 0 && <p className="empty">No comments yet. Start the conversation.</p>}
            </div>
          </section>
        </section>

        <aside className="sidebar"><div className="section-heading"><div><p className="eyebrow">FRESHLY SQUEEZED</p><h2>Video feed</h2></div></div>
          {videos.map(video => <button className={video.id === selected ? "video-card active" : "video-card"} key={video.id} onClick={() => { setSelected(video.id); setNotice(""); }}><span className="thumb"><span>▶</span></span><span className="video-card-copy"><strong>{video.title}</strong><small>{video.creator} · {video.comments.length} comments</small></span></button>)}
          <div className="sidebar-note"><strong>OrangeTube rule #1</strong><p>GIFs belong in comments. Nowhere else.</p></div>
        </aside>
      </div>
      <footer>© {new Date().getFullYear()} OrangeTube · Made of orange.</footer>
    </main>
  );
}