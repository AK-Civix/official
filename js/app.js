/* new/js/app.js */

import { supabase as supabaseClient } from './supabase.js';

console.log("Supabase initialized successfully");

// Stats Loader
async function loadStats() {
    if (!supabaseClient) return;
    try {
        const { count, error } = await supabaseClient
            .from("issues")
            .select("*", { count: 'exact', head: true });
            
        const { data: fixedData, error: fixedError } = await supabaseClient
            .from("issues")
            .select("*")
            .eq("status", "Fixed");

        if (error || fixedError) throw error || fixedError;

        document.getElementById("stat-total").innerText = count || 0;
        document.getElementById("stat-resolved").innerText = (fixedData ? fixedData.length : 0);
    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Feed Loader
async function loadFeed(limit = 6) {
    if (!supabaseClient) return;
    const feedContainer = document.getElementById("feed-grid");
    if (!feedContainer) return;

    feedContainer.innerHTML = '<div class="loader">Loading reports...</div>';

    try {
        const { data, error } = await supabaseClient
            .from("issues")
            .select("*")
            .order("upvotes", { ascending: false }) // Sort by priority
            .limit(limit);

        if (error) throw error;

        feedContainer.innerHTML = "";
        data.forEach(issue => {
            const card = createIssueCard(issue);
            feedContainer.appendChild(card);
        });

        // Trigger reveal animation for new items
        observeReveals();

    } catch (err) {
        console.error("Error loading feed:", err);
        feedContainer.innerHTML = '<p class="error">Failed to load reports. Please try again later.</p>';
    }
}

// Card Generator
function createIssueCard(issue) {
    const card = document.createElement("div");
    card.className = "issue-card reveal";
    
    let mediaHtml = "";
    if (issue.media_url) {
        if (issue.media_url.includes(".mp4") || issue.media_url.includes(".webm")) {
            mediaHtml = `<video src="${issue.media_url}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>`;
        } else {
            mediaHtml = `<img src="${issue.media_url}" alt="${issue.category}" loading="lazy">`;
        }
    } else {
        mediaHtml = `<div class="placeholder-img" style="background:#f1f5f9; display:flex; align-items:center; justify-content:center; height:100%; color:#94a3b8;"><span style="font-size:40px;">📍</span></div>`;
    }

    const statusClass = issue.status ? issue.status.replace(/\s+/g, '') : 'Reported';

    card.innerHTML = `
        <div class="issue-media">${mediaHtml}</div>
        <div class="issue-content">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="issue-badge status-${statusClass}">${issue.status || 'Reported'}</span>
                <div class="vote-controls" style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.8); padding: 4px 8px; border-radius: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.3);">
                    <button class="vote-btn" onclick="event.stopPropagation(); window.voteIssue(${issue.id}, ${issue.upvotes || 0}, 1)" style="border: none; background: transparent; cursor: pointer; color: #64748b; display: flex; align-items: center; transition: 0.2s;" onmouseover="this.style.color='#10b981'" onmouseout="this.style.color='#64748b'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>
                    <span style="font-weight: 700; color: #1e293b; font-size: 14px; min-width: 20px; text-align: center;">${issue.upvotes || 0}</span>
                    <button class="vote-btn" onclick="event.stopPropagation(); window.voteIssue(${issue.id}, ${issue.upvotes || 0}, -1)" style="border: none; background: transparent; cursor: pointer; color: #64748b; display: flex; align-items: center; transition: 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#64748b'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                </div>
            </div>
            <div class="issue-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${issue.location || 'Unknown Location'}
            </div>
            <h3 class="issue-title">${issue.category || 'Civic Issue'}</h3>
            <p class="issue-desc" style="font-size: 14px; color: #64748b; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${issue.description || 'No description provided.'}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-bottom: 8px;">
                <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">ID: #${issue.id}</span>
                <button class="comment-toggle-btn" onclick="window.toggleComments(${issue.id})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                    Comments
                </button>
            </div>
            
            <div id="comments-${issue.id}" class="comments-container">
                <div class="comments-inner">
                    <div class="comment-list" id="comment-list-${issue.id}">
                        <!-- Comments loaded here -->
                    </div>
                    <div class="comment-input-area">
                        <textarea id="comment-input-${issue.id}" class="comment-field" placeholder="Share your thoughts..." rows="1"></textarea>
                        <button class="comment-submit-btn" onclick="window.submitComment(${issue.id})" title="Send Comment">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Reveal Animation Observer
function observeReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Form Submission
async function handleSub(e) {
    if (e) e.preventDefault();
    if (!supabaseClient) return;

    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";

    const payload = {
        category: document.getElementById("category").value,
        location: document.getElementById("location").value,
        description: document.getElementById("description").value,
        media_url: document.getElementById("media_url").value,
        status: "Reported",
        upvotes: 0
    };

    try {
        const { data, error } = await supabaseClient
            .from("issues")
            .insert([payload]);

        if (error) throw error;

        alert("Success! Your report has been submitted for review.");
        window.location.href = "feed.html";
    } catch (err) {
        console.error("Submission error:", err);
        alert("Submission failed. Please check your connection.");
    } finally {
        if (loader) loader.style.display = "none";
    }
}

// Voting Logic
async function voteIssue(id, currentVotes, delta) {
    if (!supabaseClient) return;
    
    try {
        // Use the secure Database Function (RPC) instead of a direct update
        const { error } = await supabaseClient
            .rpc('vote_issue', { target_id: id, delta: delta });
            
        if (error) throw error;
        
        // Refresh feed to show updated counts and order
        loadFeed();
    } catch (err) {
        console.error("Voting error:", err);
    }
}

// COMMENT LOGIC
async function toggleComments(issueId) {
    const container = document.getElementById(`comments-${issueId}`);
    if (!container) return;

    const isActive = container.classList.toggle('active');
    if (isActive) {
        loadComments(issueId);
    }
}

async function loadComments(issueId) {
    const list = document.getElementById(`comment-list-${issueId}`);
    if (!list) return;

    list.innerHTML = '<div style="font-size:12px; color:#94a3b8; padding:10px;">Loading comments...</div>';

    try {
        const { data, error } = await supabaseClient
            .from('comments')
            .select('*')
            .eq('issue_id', issueId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            list.innerHTML = `
                <div class="no-comments">
                    <div style="font-size: 24px; margin-bottom: 8px;">💭</div>
                    No comments yet. Be the first to start the conversation!
                </div>`;
            return;
        }

        list.innerHTML = data.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-user">
                         ${comment.user_name || 'Anonymous'}
                    </div>
                    <div class="comment-date">
                        ${new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
                <div class="comment-body">${comment.content}</div>
            </div>
        `).join('');
        
        // Scroll to bottom
        list.scrollTop = list.scrollHeight;

    } catch (err) {
        console.error("Error loading comments:", err);
        list.innerHTML = '<div style="font-size:12px; color:#ef4444; padding:10px;">Error loading comments.</div>';
    }
}

async function submitComment(issueId) {
    const input = document.getElementById(`comment-input-${issueId}`);
    if (!input || !input.value.trim()) return;

    const content = input.value.trim();
    input.value = "";
    input.disabled = true;

    try {
        // Use the secure Database Function (RPC) instead of a direct insert
        const { error } = await supabaseClient
            .rpc('add_comment', { target_id: issueId, comment_content: content });

        if (error) throw error;

        // Reload comments
        loadComments(issueId);
    } catch (err) {
        console.error("Error posting comment:", err);
        alert("Failed to post comment. " + (err.message || "Please check your connection."));
    } finally {
        input.disabled = false;
        input.focus();
    }
}

window.voteIssue = voteIssue;
window.toggleComments = toggleComments;
window.submitComment = submitComment;

// Global Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Check if we are on landing page
    if (document.getElementById("stat-total")) {
        loadStats();
    }
    
    if (document.getElementById("feed-grid")) {
        loadFeed();
    }

    const form = document.getElementById("report-form");
    if (form) {
        form.addEventListener("submit", handleSub);
    }
    
    observeReveals();
});
