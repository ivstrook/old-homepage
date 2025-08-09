// モバイルメニューのトグル機能
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // hidden-menu クラスと visible-menu クラスを切り替える
            mobileMenu.classList.toggle('mobile-menu-hidden');
            mobileMenu.classList.toggle('mobile-menu-visible');
        });
    }

    // ページ読み込み時にホームを表示
    showHomePage();
});

// モバイルメニューを閉じる関数
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('mobile-menu-hidden');
        mobileMenu.classList.remove('mobile-menu-visible');
    }
}

// ページ表示を管理する関数
async function showPage(pagePath) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found!');
        return;
    }

    try {
        const response = await fetch(pagePath);
        if (!response.ok) {
            throw new Error(`Failed to load page: ${response.statusText}`);
        }
        const html = await response.text();
        mainContent.innerHTML = html; // mainContentに読み込んだHTMLを直接設定

        // ページが切り替わったらモバイルメニューを閉じる
        closeMobileMenu();

        // ページトップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading page:', error);
        showCustomMessage(`ページの読み込みに失敗しました: ${error.message}`, "error");
    }
}

// ホームページを表示する関数
function showHomePage() {
    // pages/home.htmlを読み込むように変更します。
    showPage('pages/home.html');
}


// Mailto機能のための変数
let mailtoLink = '';

// モーダル要素を取得 (index.htmlに定義されている)
const mailtoModal = document.getElementById('mailtoModal');
const customMessageModal = document.getElementById('customMessageModal');
const customMessageTitle = document.getElementById('customMessageTitle');
const customMessageText = document.getElementById('customMessageText');

// モーダルを開く関数
function openModal() {
    if (mailtoModal) {
        mailtoModal.style.display = 'flex'; // Flexboxを使って中央揃え
    }
}

// モーダルを閉じる関数
function closeModal() {
    if (mailtoModal) {
        mailtoModal.style.display = 'none';
    }
}

// メール作成画面に進む関数
function proceedToMailto() {
    if (mailtoLink) {
        window.location.href = mailtoLink;
    }
    closeModal(); // モーダルを閉じる
}

// カスタムメッセージボックスの表示 (alert()の代替)
function showCustomMessage(message, type = "info") {
    if (customMessageModal && customMessageTitle && customMessageText) {
        customMessageTitle.textContent = type === "error" ? "エラー" : "情報";
        customMessageTitle.className = `text-2xl font-bold mb-4 ${type === "error" ? "text-red-400" : "text-amber-400"}`;
        customMessageText.textContent = message;
        customMessageModal.style.display = 'flex';
    }
}

// お問い合わせフォームの送信イベントを処理 (イベント委譲を使用)
// main-content 内に動的に読み込まれるフォームに対応するため、document.body にリスナーをアタッチ
document.body.addEventListener('submit', function(event) {
    // イベントが contact-form から発生したかを確認
    if (event.target && event.target.id === 'contact-form') {
        event.preventDefault(); // デフォルトのフォーム送信をキャンセル

        const nameInput = event.target.querySelector('#name');
        const emailInput = event.target.querySelector('#email');
        const messageInput = event.target.querySelector('#message');

        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        const message = messageInput ? messageInput.value : '';

        // メールアドレスのバリデーション (簡易的)
        if (!email.includes('@') || !email.includes('.')) {
            showCustomMessage("無効なメールアドレスです。有効なメールアドレスを入力してください。", "error");
            return;
        }

        const recipient = 'jard.social@proton.me';
        const subject = encodeURIComponent(`ウェブサイトからのお問い合わせ: ${name}`);
        const body = encodeURIComponent(`お名前: ${name}\nメールアドレス: ${email}\n\nメッセージ:\n${message}`);

        mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

        // モーダルを表示してユーザーに確認を求める
        openModal();
    }
});