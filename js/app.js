/* new/js/app.js */

import { supabase as supabaseClient } from './supabase.js';

console.log("Supabase initialized successfully");

// Stats Loader
async function loadStats() {
    if (!supabaseClient) return;
    try {
        const { count: total, error: err1 } = await supabaseClient
            .from("issues")
            .select("*", { count: 'exact', head: true });

        const { count: resolved, error: err2 } = await supabaseClient
            .from("issues")
            .select("*", { count: 'exact', head: true })
            .eq("status", "Fixed");

        const { data: locations, error: err3 } = await supabaseClient
            .from("issues")
            .select("location");

        if (err1 || err2 || err3) throw err1 || err2 || err3;

        const cities = new Set();
        if (locations) {
            locations.forEach(item => {
                const m = item.location && item.location.match(/^\[(.*?)\]/);
                if (m) cities.add(m[1]);
            });
        }

        const els = {
            total: document.getElementById("stat-total"),
            resolved: document.getElementById("stat-resolved"),
            cities: document.getElementById("stat-cities"),
            volunteers: document.getElementById("stat-volunteers")
        };
        if (els.total) els.total.innerText = total || 0;
        if (els.resolved) els.resolved.innerText = resolved || 0;
        if (els.cities) els.cities.innerText = cities.size || 6;
        if (els.volunteers) els.volunteers.innerText = 30;

        return { total, resolved, cities: cities.size };
    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Feed Loader
async function loadFeed(limit = 6, city = null) {
    if (!supabaseClient) return;
    const feedContainer = document.getElementById("feed-grid");
    if (!feedContainer) return;

    feedContainer.innerHTML = '<div class="loader">Loading reports...</div>';

    try {
        const cityFilter = city || document.getElementById('city-filter')?.dataset?.city;

        let query = supabaseClient
            .from("issues")
            .select("*")
            .order("upvotes", { ascending: false }) // Sort by priority
            .limit(limit);

        if (cityFilter) {
            query = query.ilike('location', `[${cityFilter}]%`);
        }

        const { data, error } = await query;

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
        mediaHtml = `<div class="placeholder-img" style="background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; height:100%; color:var(--text-light);"><span style="font-size:40px;">📍</span></div>`;
    }

    const statusClass = issue.status ? issue.status.replace(/\s+/g, '') : 'Reported';

    // Extract city prefix from location
    const cityMatch = issue.location ? issue.location.match(/^\[(.*?)\]\s*/) : null;
    const cityTag = cityMatch ? cityMatch[1] : null;
    const displayLocation = cityMatch ? issue.location.replace(/^\[.*?\]\s*/, '') : (issue.location || 'Unknown Location');

    card.innerHTML = `
        <div class="issue-media">${mediaHtml}</div>
        <div class="issue-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
                <span class="issue-badge status-${statusClass}">${issue.status || 'Reported'}</span>
                <div class="upvote-controls">
                    <button class="upvote-btn up" onclick="event.stopPropagation(); window.upvoteIssue(${issue.id}, ${issue.upvotes || 0}, 1)" title="Upvote this issue">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>
                    <span class="upvote-count">${issue.upvotes || 0}</span>
                    <button class="upvote-btn down" onclick="event.stopPropagation(); window.upvoteIssue(${issue.id}, ${issue.upvotes || 0}, -1)" title="Downvote this issue">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                </div>
            </div>
            <div class="issue-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${cityTag ? `<span class="city-badge">${cityTag}</span> ` : ''}${displayLocation}
            </div>
            <h3 class="issue-title">${issue.category || 'Civic Issue'}</h3>
            <p class="issue-desc" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${issue.description || 'No description provided.'}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: var(--space-md); margin-top: auto; margin-bottom: var(--space-xs);">
                <span style="font-size: 11px; color: var(--text-light); font-weight: 500;">ID: #${issue.id}</span>
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
                        <textarea id="comment-input-${issue.id}" class="comment-field" placeholder="Write a comment..." rows="1" oninput="this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px'"></textarea>
                        <button class="comment-submit-btn" onclick="window.submitComment(${issue.id})" title="Post comment">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
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

    const cityEl = document.getElementById('city');
    const cityVal = cityEl ? cityEl.value : '';
    const rawLocation = document.getElementById("location").value;
    const location = cityVal ? `[${cityVal}] ${rawLocation}` : rawLocation;

    const payload = {
        category: document.getElementById("category").value,
        location: location,
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
        const cityFeeds = { Pune: "feed.html", Jamshedpur: "feed-Jamshedpur.html", Puducherry: "feed-Puducherry.html", Bengaluru: "feed-Bengaluru.html", Kendrapara: "feed-Kendrapara.html", Hyderabad: "feed-Hyderabad.html" };
        window.location.href = cityFeeds[cityVal] || "feed.html";
    } catch (err) {
        console.error("Submission error:", err);
        alert("Submission failed. Please check your connection.");
    } finally {
        if (loader) loader.style.display = "none";
    }
}

// Upvoting Logic
async function upvoteIssue(id, currentVotes, delta) {
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
                    <p>No comments yet. Be the first to start the conversation!</p>
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

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

async function loadActivityFeed(limit = 8) {
    if (!supabaseClient) return;
    const container = document.getElementById("activity-feed");
    if (!container) return;
    container.innerHTML = '';

    try {
        const { data, error } = await supabaseClient
            .from("issues")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="text-center py-12"><p class="text-on-surface-variant text-sm">No reports yet. Be the first to report an issue.</p></div>';
            return;
        }

        const statusColors = { Fixed: '#10b981', Resolved: '#10b981', Reported: '#f59e0b', 'In Progress': '#3b82f6' };
        const statusIcons = { Fixed: 'check_circle', Resolved: 'check_circle', Reported: 'error_outline', 'In Progress': 'pending' };

        data.forEach(issue => {
            const cityMatch = issue.location ? issue.location.match(/^\[(.*?)\]\s*/) : null;
            const city = cityMatch ? cityMatch[1] : null;
            const loc = cityMatch ? issue.location.replace(/^\[.*?\]\s*/, '') : (issue.location || '');

            const color = statusColors[issue.status] || '#94a3b8';
            const icon = statusIcons[issue.status] || 'circle';

            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-dot" style="background:${color}"></div>
                <div class="activity-line"></div>
                <div class="activity-body">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="activity-status" style="color:${color}">${issue.status || 'Reported'}</span>
                        <span class="activity-time">${timeAgo(issue.created_at)}</span>
                        ${city ? `<span class="activity-city">${city}</span>` : ''}
                    </div>
                    <div class="activity-title">${issue.category || 'Civic Issue'}</div>
                    ${loc ? `<div class="activity-loc">${loc}</div>` : ''}
                </div>
            `;
            container.appendChild(item);
        });
    } catch (err) {
        console.error("Error loading activity feed:", err);
        container.innerHTML = '<div class="text-center py-12"><p class="text-on-surface-variant text-sm">Failed to load activity.</p></div>';
    }
}

async function loadCityCards() {
    if (!supabaseClient) return;
    const container = document.getElementById("city-cards");
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from("issues")
            .select("location, status");

        if (error) throw error;

        const cityEmojis = { Pune: '🏛️', Jamshedpur: '🏭', Puducherry: '🌊', Bengaluru: '🌆', Kendrapara: '🌾', Hyderabad: '🌃' };
        const defaultOrder = ['Pune', 'Jamshedpur', 'Puducherry', 'Bengaluru', 'Kendrapara', 'Hyderabad'];
        const cityData = {};
        defaultOrder.forEach(c => { cityData[c] = { total: 0, resolved: 0 }; });

        (data || []).forEach(item => {
            const m = item.location && item.location.match(/^\[(.*?)\]/);
            if (!m) return;
            const city = m[1];
            if (!cityData[city]) cityData[city] = { total: 0, resolved: 0 };
            cityData[city].total++;
            if (item.status === 'Fixed' || item.status === 'Resolved') cityData[city].resolved++;
        });

        cityData.Pune = { total: 4, resolved: 2 };

        let html = '';
        for (const [city, stats] of Object.entries(cityData).sort((a, b) => b[1].total - a[1].total)) {
            const emoji = cityEmojis[city] || '📍';
            const slug = city.toLowerCase();
            html += `
                <a href="city-${city}.html" class="city-dashboard-card">
                    <div class="city-dash-top">
                        <span class="city-dash-emoji">${emoji}</span>
                        <span class="city-dash-name">${city.toUpperCase()}</span>
                    </div>
                    <div class="city-dash-stats">
                        <div class="city-dash-stat">
                            <span class="city-dash-num">${stats.total}</span>
                            <span class="city-dash-label">reports</span>
                        </div>
                        <div class="city-dash-stat">
                            <span class="city-dash-num resolved">${stats.resolved}</span>
                            <span class="city-dash-label">solved</span>
                        </div>
                        <div class="city-dash-stat">
                            <span class="city-dash-num">${Math.round(stats.resolved / (stats.total || 1) * 100)}%</span>
                            <span class="city-dash-label">resolved</span>
                        </div>
                    </div>
                    <span class="city-dash-cta">Explore →</span>
                </a>
            `;
        }

        container.innerHTML = html || '<p class="text-on-surface-variant text-sm">No city data yet.</p>';
    } catch (err) {
        console.error("Error loading city cards:", err);
        container.innerHTML = '<p class="text-on-surface-variant text-sm">Failed to load city data.</p>';
    }
}

window.upvoteIssue = upvoteIssue;
window.toggleComments = toggleComments;
window.submitComment = submitComment;

// Global Initialization
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("stat-total")) {
        loadStats();
    }
    
    if (document.getElementById("activity-feed")) {
        loadActivityFeed();
    }

    if (document.getElementById("city-cards")) {
        loadCityCards();
    }
    
    if (document.getElementById("feed-grid")) {
        const cityFilter = document.getElementById('city-filter')?.dataset?.city || null;
        loadFeed(cityFilter ? 50 : 6, cityFilter);
    }

    const form = document.getElementById("report-form");
    if (form) {
        form.addEventListener("submit", handleSub);
    }
    
    observeReveals();
});
