/* new/js/app.js */

const SUPABASE_URL = "https://bxtsttllyscfvawvhhas.supabase.co";
const SUPABASE_KEY = "sb_publishable_gwJp2GV1r1lqKM5siFCeig_9JkaqV6o";

let supabaseClient;

// Initialize Supabase
function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase initialized successfully");
    } else {
        console.error("Supabase library not found. Please ensure it is loaded.");
    }
}

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
            .order("id", { ascending: false })
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
            <span class="issue-badge status-${statusClass}">${issue.status || 'Reported'}</span>
            <div class="issue-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${issue.location || 'Unknown Location'}
            </div>
            <h3 class="issue-title">${issue.category || 'Civic Issue'}</h3>
            <p class="issue-desc" style="font-size: 14px; color: #64748b; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${issue.description || 'No description provided.'}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">ID: #${issue.id}</span>
                <button class="cta-btn" style="padding: 6px 12px; font-size: 12px; background: #f1f5f9; color: #475569;" onclick="alert('Viewing details...')">View Details</button>
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
        status: "Reported"
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

// Global Initialization
document.addEventListener("DOMContentLoaded", () => {
    initSupabase();
    
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
