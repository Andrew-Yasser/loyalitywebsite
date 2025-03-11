// دالة للتمرير إلى القسم المطلوب عند الضغط على زر "انضم الآن"
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

// إضافة حدث عند إرسال نموذج التسجيل
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#signup form");
    
    if (!form) {
        console.error("لم يتم العثور على النموذج بمعرف '#signup form'");
        return;
    }
    
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة
        
        // الحصول على قيم الحقول
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[type="tel"]').value;
        const store = form.querySelector('select').value;
        const invoiceTotal = form.querySelector('input[type="number"]').value;
        
        // التحقق من تعبئة جميع الحقول
        if (name && email && phone && store && invoiceTotal) {
            // إرسال البيانات إلى Google Sheet
            sendDataToGoogleSheet(name, email, phone, store, invoiceTotal, form);
        } else {
            alert("يرجى ملء جميع الحقول.");
        }
    });
});

// دالة لإرسال البيانات إلى Google Sheet
function sendDataToGoogleSheet(name, email, phone, store, invoiceTotal, form) {
    // معرف Google Sheet
    const sheetId = "1ghahy_4WKmfSzI7E-XF7sIMl54Bb0x24TbcKaejGWp0";
    
    // إنشاء رابط نموذج Google Script Web App 
    const scriptURL = `https://script.google.com/macros/s/AKfycbwdFWfTGaSI29ErlvFAKX8mBUjqvb5uo11IBkxjwzlQ-uSbs2QbQyWmEPQ6Mxn04w1d/exec`;
    
    // إعداد البيانات للإرسال
    const formData = new FormData();
    formData.append('sheetId', sheetId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('store', store);
    formData.append('invoiceTotal', invoiceTotal);
    formData.append('timestamp', new Date().toISOString());
    
    // عرض رسالة تحميل
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) {
        console.error("لم يتم العثور على زر التقديم");
        return;
    }
    
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';
    submitButton.disabled = true;
    
    // إرسال البيانات
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`فشل في إرسال البيانات: ${response.status} ${response.statusText}`);
        }
    })
    .then(data => {
        console.log('Success:', data);
        alert(`مرحبًا ${name}! تم تسجيلك بنجاح.`);
        form.reset(); // إعادة تعيين الحقول بعد التسجيل
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
    })
    .finally(() => {
        // إعادة زر التقديم إلى حالته الأصلية
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });
}

// إضافة حدث للتمرير السلس للروابط الداخلية
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.error(`Element with selector "${targetId}" not found`);
            }
        });
    });
});