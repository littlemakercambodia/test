/* ================================================================
   LITTLEMAKER CAMBODIA — careers.js
   Dynamic Facebook-style Career Posts Renderer
   ================================================================ */

'use strict';

const DEFAULT_CAREER_POSTS = [
    {
        id: "job1",
        title: "CNC Machine Operator",
        desc: "We are looking for an experienced CNC operator to handle our high-precision milling machines.",
        location: "Phnom Penh",
        type: "Full Time",
        image: "images/cabinet.jpg",
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hrs ago
        likes: 1200,
        commentsCount: 120,
        shares: 45
    },
    {
        id: "job2",
        title: "Sales Executive",
        desc: "Join our dynamic sales team to promote our premium office furniture and industrial parts.",
        location: "Phnom Penh",
        type: "Full Time",
        image: "images/Husky1.png",
        timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hrs ago
        likes: 845,
        commentsCount: 89,
        shares: 21
    },
    {
        id: "job3",
        title: "Mechanical Engineer",
        desc: "Seeking a skilled mechanical engineer for CAD design and product development.",
        location: "Svay Rieng",
        type: "Full Time",
        image: "images/backgroud_1.png",
        timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
        likes: 2100,
        commentsCount: 340,
        shares: 150
    }
];

let fbData = JSON.parse(localStorage.getItem('lm_fb_data')) || {};
let careerPosts = [];
let currentLightboxPostId = null;

function loadCareerPosts() {
    try {
        const stored = localStorage.getItem('lm_career_posts');
        if (stored) {
            careerPosts = JSON.parse(stored);
        } else {
            careerPosts = [...DEFAULT_CAREER_POSTS];
            localStorage.setItem('lm_career_posts', JSON.stringify(careerPosts));
        }
    } catch(e) {
        careerPosts = [...DEFAULT_CAREER_POSTS];
    }
}

function saveFbData() {
    localStorage.setItem('lm_fb_data', JSON.stringify(fbData));
}

const REACTION_UI = {
    like: { icon: 'fa-solid fa-thumbs-up', text: 'Like', color: '#0866ff', class: 'liked' },
    love: { icon: 'fa-solid fa-heart', text: 'Love', color: '#f33e58', class: 'loved' },
    haha: { icon: 'fa-regular fa-face-laugh-squint', text: 'Haha', color: '#f7b125', class: 'haha' },
    wow: { icon: 'fa-solid fa-face-surprise', text: 'Wow', color: '#f7b125', class: 'wow' },
    sad: { icon: 'fa-regular fa-face-sad-tear', text: 'Sad', color: '#f7b125', class: 'sad' },
    angry: { icon: 'fa-solid fa-face-angry', text: 'Angry', color: '#e9710f', class: 'angry' }
};

function getReactionUI(reaction) {
    if (!reaction || !REACTION_UI[reaction]) {
        return { icon: 'fa-regular fa-thumbs-up', text: 'Like', color: '', class: '' };
    }
    return REACTION_UI[reaction];
}

function timeAgo(time) {
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " mins ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
    return Math.floor(diff / 86400) + " days ago";
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

function renderCareersFeed() {
    const feed = document.getElementById('dynamic-careers-feed');
    if (!feed) return;

    loadCareerPosts();

    if (careerPosts.length === 0) {
        feed.innerHTML = '<div style="text-align:center; padding: 50px; color: #666;">No career posts available at the moment.</div>';
        return;
    }

    // Sort by timestamp descending
    careerPosts.sort((a, b) => b.timestamp - a.timestamp);

    feed.innerHTML = careerPosts.map(post => {
        // Init fbData for this post if not exists
        if (!fbData[post.id]) {
            fbData[post.id] = { reaction: null, comments: [] };
        } else if (fbData[post.id].liked !== undefined) {
            // Migration from old schema
            fbData[post.id].reaction = fbData[post.id].liked ? 'like' : null;
            delete fbData[post.id].liked;
            saveFbData();
        }
        
        const data = fbData[post.id];
        const reaction = data.reaction;
        const totalComments = post.commentsCount + data.comments.length;
        const totalLikes = post.likes + (reaction ? 1 : 0);
        const ui = getReactionUI(reaction);

        return `
        <div class="fb-post-card fade-in" data-post-id="${post.id}">
            <div class="fb-post-header">
                <img src="images/Logo.png" alt="LittleMaker" class="fb-avatar">
                <div class="fb-header-info">
                    <strong>LittleMaker Cambodia</strong>
                    <span>${timeAgo(post.timestamp)} · <i class="fa-solid fa-earth-americas"></i></span>
                </div>
                <div class="fb-header-dots"><i class="fa-solid fa-ellipsis"></i></div>
            </div>
            <div class="fb-post-content">
                <h3>${post.title}</h3>
                <p class="fb-post-text">
                    <span>${post.desc}</span>
                    <br><br>
                    <span style="font-size: 0.9em; color: #555; line-height: 1.6; display: block; background: #f0f2f5; padding: 12px; border-radius: 8px;">
                        📍 <strong>Location:</strong> ${post.location || 'Phnom Penh'} &nbsp; | &nbsp; 🕒 <strong>Type:</strong> ${post.type || 'Full Time'}<br>
                        💰 <strong>Salary:</strong> ${post.salary || 'Negotiable'} &nbsp; | &nbsp; 👥 <strong>Vacancies:</strong> ${post.vacancies || 1} &nbsp; | &nbsp; 🏷️ <strong>Status:</strong> <span style="color:${post.status === 'Closed' ? 'red' : 'green'}; font-weight:bold;">${post.status || 'Open'}</span>
                    </span>
                </p>
            </div>
            ${post.image ? `
            <div class="fb-post-image" onclick="openFbLightbox(this)">
                <img src="${post.image}" alt="${post.title}">
                <div class="fb-img-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i> View Full Image</div>
            </div>` : ''}
            <div class="fb-post-footer">
                <div class="fb-stats">
                    <div class="fb-reactions" data-base="${post.likes}" ${reaction ? 'data-liked="true"' : ''}>
                        <i class="fa-solid fa-thumbs-up" style="color:#0866ff"></i> <i class="fa-solid fa-heart" style="color:#f33e58"></i> 
                        ${formatNumber(totalLikes)} ${reaction ? '<span class="you-liked">(You)</span>' : ''}
                    </div>
                    <div class="fb-comments" data-base="${post.commentsCount}">${formatNumber(totalComments)} Comments · ${post.shares} Shares</div>
                </div>
                <div class="fb-actions">
                    <div class="fb-like-wrapper">
                        <button class="fb-btn ${ui.class}" style="${ui.color ? `color: ${ui.color};` : ''}" onclick="toggleFbLike(this)">
                            <i class="${ui.icon}"></i> <span>${ui.text}</span>
                        </button>
                        <div class="fb-reaction-box">
                            <div class="fb-reaction-icon r-like" onclick="setReaction(event, this, '${post.id}', 'like')"><i class="fa-solid fa-thumbs-up"></i></div>
                            <div class="fb-reaction-icon r-love" onclick="setReaction(event, this, '${post.id}', 'love')"><i class="fa-solid fa-heart"></i></div>
                            <div class="fb-reaction-icon r-haha" onclick="setReaction(event, this, '${post.id}', 'haha')"><i class="fa-regular fa-face-laugh-squint"></i></div>
                            <div class="fb-reaction-icon r-wow" onclick="setReaction(event, this, '${post.id}', 'wow')"><i class="fa-solid fa-face-surprise"></i></div>
                            <div class="fb-reaction-icon r-sad" onclick="setReaction(event, this, '${post.id}', 'sad')"><i class="fa-regular fa-face-sad-tear"></i></div>
                            <div class="fb-reaction-icon r-angry" onclick="setReaction(event, this, '${post.id}', 'angry')"><i class="fa-solid fa-face-angry"></i></div>
                        </div>
                    </div>
                    <button class="fb-btn" onclick="toggleFbComment(this)"><i class="fa-regular fa-comment"></i> <span>Comment</span></button>
                    <button class="fb-btn" onclick="shareFbPost(this)"><i class="fa-solid fa-share"></i> <span>Share</span></button>
                    <a href="contact.html" class="fb-btn fb-btn-primary"><i class="fa-solid fa-paper-plane"></i> <span>Apply</span></a>
                </div>
                <!-- Comments Section (Hidden initially unless toggled) -->
                <div class="fb-comments-section" style="display:none; margin-top: 12px; border-top: 1px solid #ced0d4; padding-top: 12px;">
                    <div style="display: flex; gap: 8px;">
                        <div style="width:32px; height:32px; border-radius:50%; background:var(--blue); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold;">Me</div>
                        <input type="text" class="fb-comment-input" placeholder="Write a comment... (Press Enter)" style="flex: 1; border-radius: 20px; border: 1px solid #ced0d4; padding: 8px 16px; outline: none; background: #f0f2f5;" onkeypress="handleFbComment(event, this)">
                    </div>
                    <div class="fb-comments-list" style="margin-top: 12px; font-size: 0.9rem;">
                        ${data.comments.map(c => createCommentHtmlString(post.id, c)).join('')}
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Trigger scroll reveal animation for newly injected posts
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        feed.querySelectorAll('.fade-in').forEach(el => io.observe(el));
    }
}

function createCommentHtmlString(postId, c) {
    const escapedText = c.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
        <div id="comment-${c.id}" style="display:flex; gap:8px; margin-bottom:12px;">
            <div style="width:32px; height:32px; border-radius:50%; background:var(--blue); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold; flex-shrink:0;">Me</div>
            <div style="display:flex; flex-direction:column; align-items:flex-start;">
                <div style="background: #f0f2f5; padding: 8px 12px; border-radius: 18px; line-height: 1.4; display: inline-block;">
                    <strong>You</strong><br>
                    <span class="comment-text">${escapedText}</span>
                </div>
                <div style="font-size:0.75rem; color:#65676b; margin-top:4px; margin-left:8px; display:flex; gap:12px;">
                    <span style="cursor:pointer; font-weight:600;" onclick="editComment('${postId}', ${c.id})">Edit</span>
                    <span style="cursor:pointer; font-weight:600;" onclick="deleteComment('${postId}', ${c.id})">Delete</span>
                </div>
            </div>
        </div>
    `;
}

function updatePostReactionsAndCommentsUI(postId) {
    const card = document.querySelector(`.fb-post-card[data-post-id="${postId}"]`);
    const sidebar = document.querySelector('.fb-lightbox-sidebar');
    
    const post = careerPosts.find(p => p.id === postId);
    if(!post) return;
    
    const data = fbData[postId];
    const reaction = data.reaction;
    const totalComments = post.commentsCount + data.comments.length;
    const totalLikes = post.likes + (reaction ? 1 : 0);
    const htmlComments = data.comments.map(c => createCommentHtmlString(postId, c)).join('');
    const ui = getReactionUI(reaction);

    [card, (sidebar && sidebar.getAttribute('data-post-id') === postId ? sidebar : null)].forEach(el => {
        if(!el) return;
        
        // Update Like btn
        const likeBtn = el.querySelector('.fb-like-wrapper .fb-btn');
        if (likeBtn) {
            const icon = likeBtn.querySelector('i');
            const text = likeBtn.querySelector('span');
            
            // Remove previous reaction classes
            likeBtn.className = `fb-btn ${ui.class}`;
            likeBtn.style.color = ui.color || '';
            if (icon) icon.className = ui.icon;
            if (text) text.innerText = ui.text;
        }

        // Update stats
        const reactionsSpan = el.querySelector('.fb-reactions');
        if (reactionsSpan) {
            reactionsSpan.innerHTML = `<i class="fa-solid fa-thumbs-up" style="color:#0866ff"></i> <i class="fa-solid fa-heart" style="color:#f33e58"></i> ${formatNumber(totalLikes)} ${reaction ? '<span class="you-liked">(You)</span>' : ''}`;
        }
        
        const commentsSpan = el.querySelector('.fb-comments');
        if (commentsSpan) {
            commentsSpan.innerText = `${formatNumber(totalComments)} Comments · ${post.shares} Shares`;
        }

        // Update Comments list
        const cList = el.querySelector('.fb-comments-list');
        if (cList) {
            cList.innerHTML = htmlComments;
        }
    });
}

function toggleFbLike(btn) {
    let card = btn.closest('.fb-post-card') || btn.closest('.fb-lightbox-sidebar');
    if (!card) return;
    let postId = card.getAttribute('data-post-id');
    if (!postId) return;
    
    if(!fbData[postId]) fbData[postId] = { reaction: null, comments: [] };
    
    // Default toggle is 'like' if currently null, or null if currently has any reaction
    if (fbData[postId].reaction) {
        fbData[postId].reaction = null;
    } else {
        fbData[postId].reaction = 'like';
    }
    
    saveFbData();
    updatePostReactionsAndCommentsUI(postId);
}

function setReaction(event, btn, postId, reactionType) {
    event.stopPropagation(); // prevent triggering parent clicks
    
    if (!postId) {
        let card = btn.closest('.fb-post-card') || btn.closest('.fb-lightbox-sidebar');
        if (card) postId = card.getAttribute('data-post-id');
    }
    if (!postId) return;
    
    if(!fbData[postId]) fbData[postId] = { reaction: null, comments: [] };
    
    // If clicking the same reaction, toggle it off
    if (fbData[postId].reaction === reactionType) {
        fbData[postId].reaction = null;
    } else {
        fbData[postId].reaction = reactionType;
    }
    
    saveFbData();
    updatePostReactionsAndCommentsUI(postId);
}

function toggleFbComment(btn) {
    const footer = btn.closest('.fb-post-footer');
    const commentSection = footer.querySelector('.fb-comments-section');
    if (commentSection) {
        if (commentSection.style.display === 'none') {
            commentSection.style.display = 'block';
            commentSection.querySelector('input').focus();
        } else {
            commentSection.style.display = 'none';
        }
    }
}

function handleFbComment(e, input) {
    if (e.key === 'Enter' && input.value.trim() !== '') {
        let card = input.closest('.fb-post-card') || input.closest('.fb-lightbox-sidebar');
        let postId = card.getAttribute('data-post-id');
        if (!postId) return;

        if(!fbData[postId]) fbData[postId] = { liked: false, comments: [] };
        
        let newComment = {
            id: Date.now(),
            text: input.value.trim()
        };
        fbData[postId].comments.push(newComment);
        saveFbData();
        input.value = '';

        updatePostReactionsAndCommentsUI(postId);
        
        // scroll to bottom of comments if in lightbox
        if(document.getElementById('fbLightbox').classList.contains('active')) {
            let list = document.querySelector('.fb-lightbox-sidebar .fb-comments-list');
            if(list) list.scrollTop = list.scrollHeight;
        }
    }
}

function deleteComment(postId, commentId) {
    if(confirm("Are you sure you want to delete this comment?")) {
        fbData[postId].comments = fbData[postId].comments.filter(c => c.id !== commentId);
        saveFbData();
        updatePostReactionsAndCommentsUI(postId);
    }
}

function editComment(postId, commentId) {
    let comment = fbData[postId].comments.find(c => c.id === commentId);
    if(!comment) return;
    let newText = prompt("Edit your comment:", comment.text);
    if(newText !== null && newText.trim() !== "") {
        comment.text = newText.trim();
        saveFbData();
        updatePostReactionsAndCommentsUI(postId);
    }
}

function shareFbPost(btn) {
    if (navigator.share) {
        navigator.share({
            title: 'LittleMaker Cambodia Careers',
            text: 'Check out this job opening at LittleMaker Cambodia!',
            url: window.location.href,
        }).catch(console.error);
    } else {
        alert("Link copied to clipboard! You can now share it.");
    }
}

function openFbLightbox(el) {
    var postCard = el.closest('.fb-post-card');
    currentLightboxPostId = postCard.getAttribute('data-post-id');
    
    var imgSrc = el.querySelector('img').src;
    var textHtml = postCard.querySelector('.fb-post-content').innerHTML;
    var timeText = postCard.querySelector('.fb-header-info span').innerHTML;
    
    document.getElementById('fbLightboxImg').src = imgSrc;
    document.getElementById('fbLightboxText').innerHTML = textHtml;
    document.getElementById('fbLightboxTime').innerHTML = timeText;
    
    // Sync state
    let sidebar = document.querySelector('.fb-lightbox-sidebar');
    sidebar.setAttribute('data-post-id', currentLightboxPostId);
    updatePostReactionsAndCommentsUI(currentLightboxPostId);
    
    document.querySelector('.fb-lightbox-sidebar .fb-comments-section').style.display = 'block';
    document.getElementById('fbLightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFbLightbox() {
    document.getElementById('fbLightbox').classList.remove('active');
    document.body.style.overflow = '';
    currentLightboxPostId = null;
}

// Close on background click
function initCareers() {
    const lb = document.getElementById('fbLightbox');
    if (lb) {
        lb.addEventListener('click', function(e) {
            if(e.target === this) closeFbLightbox();
        });
    }
    
    // Auto render on load
    renderCareersFeed();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCareers);
} else {
    initCareers();
}
