import os

html_path = r"c:\Users\97154\Desktop\fmac-ops\index.html"
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Personal Data Branch Dropdown
old_personal = '''<div>
              <label data-i18n="form.sport">اللعبة</label>
              <input data-placeholder="form.sport_ph" id="inq-sport" placeholder="مثال: كرة قدم" type="text" />
            </div>'''
new_personal = '''<div>
              <label data-i18n="form.sport">اللعبة</label>
              <input data-placeholder="form.sport_ph" id="inq-sport" placeholder="مثال: كرة قدم" type="text" />
            </div>
            <div>
              <label data-i18n="form.branch">الفرع</label>
              <select id="inq-branch" required>
                <option value="" data-i18n="form.branch.select" disabled selected>-- اختر الفرع --</option>
                <option value="Fujairah" data-i18n="form.branch.fujairah">فرع الفجيرة</option>
                <option value="Dibba" data-i18n="form.branch.dibba">فرع دبا</option>
              </select>
            </div>'''
content = content.replace(old_personal, new_personal)

# 2. Calls form branch
old_calls = '''<div><label data-i18n="form.sport">اللعبة</label><input data-placeholder="form.sport_ph"
                placeholder="مثال: كرة سلة" type="text" required /></div>
          </div>'''
new_calls = '''<div><label data-i18n="form.sport">اللعبة</label><input data-placeholder="form.sport_ph"
                placeholder="مثال: كرة سلة" type="text" required /></div>
            <div>
              <label data-i18n="form.branch">الفرع</label>
              <select id="call-branch" required>
                <option value="" data-i18n="form.branch.select" disabled selected>-- اختر الفرع --</option>
                <option value="Fujairah" data-i18n="form.branch.fujairah">فرع الفجيرة</option>
                <option value="Dibba" data-i18n="form.branch.dibba">فرع دبا</option>
              </select>
            </div>
          </div>'''
content = content.replace(old_calls, new_calls)

# 3. Maintenance Building branch
old_maint_b = '''<h3 data-i18n="maint.building">صيانة المبنى</h3>
            <div class="choices">'''
new_maint_b = '''<h3 data-i18n="maint.building">صيانة المبنى</h3>
            <div style="margin-bottom: 12px; max-width: 240px;">
              <label data-i18n="form.branch">الفرع</label>
              <select id="maint-b-branch" required style="margin-top: 4px;">
                <option value="" data-i18n="form.branch.select" disabled selected>-- اختر الفرع --</option>
                <option value="Fujairah" data-i18n="form.branch.fujairah">فرع الفجيرة</option>
                <option value="Dibba" data-i18n="form.branch.dibba">فرع دبا</option>
              </select>
            </div>
            <div class="choices">'''
content = content.replace(old_maint_b, new_maint_b)

# 4. Maintenance Bus branch
old_maint_bus = '''<h3 data-i18n="maint.bus">صيانة الحافلات</h3>
            <div class="row">'''
new_maint_bus = '''<h3 data-i18n="maint.bus">صيانة الحافلات</h3>
            <div style="margin-bottom: 12px; max-width: 240px;">
              <label data-i18n="form.branch">الفرع</label>
              <select id="maint-bus-branch" required style="margin-top: 4px;">
                <option value="" data-i18n="form.branch.select" disabled selected>-- اختر الفرع --</option>
                <option value="Fujairah" data-i18n="form.branch.fujairah">فرع الفجيرة</option>
                <option value="Dibba" data-i18n="form.branch.dibba">فرع دبا</option>
              </select>
            </div>
            <div class="row">'''
content = content.replace(old_maint_bus, new_maint_bus)

# 5. Complaints Radio Buttons
old_complaints = '''<div class="choices">
              <label><input name="c-type" type="radio" required /> <span data-i18n="complaints.opt.bus">شكوى على
                  الحافلات</span></label>
              <label><input name="c-type" type="radio" required /> <span data-i18n="complaints.opt.coach">شكوى على
                  مدرب</span></label>
              <label><input name="c-type" type="radio" required /> <span data-i18n="complaints.opt.admin">شكوى على
                  إداري</span></label>
              <label><input name="c-type" type="radio" required /> <span data-i18n="complaints.opt.player">شكوى على لاعب
                  زميل</span></label>
              <label><input name="c-type" type="radio" required /> <span data-i18n="complaints.opt.driver">شكوى على
                  سائق</span></label>
              <label><input name="c-type" type="radio" required /> <span
                  data-i18n="complaints.opt.other">أخرى</span></label>
            </div>
            <label data-i18n="complaints.details">تفاصيل الشكوى</label>'''

new_complaints = '''<div class="choices">
              <label><input name="c-type" type="radio" value="bus" onchange="toggleComplaintExtra(this.value)" required /> <span data-i18n="complaints.opt.bus">شكوى على
                  الحافلات</span></label>
              <label><input name="c-type" type="radio" value="coach" onchange="toggleComplaintExtra(this.value)" required /> <span data-i18n="complaints.opt.coach">شكوى على
                  مدرب</span></label>
              <label><input name="c-type" type="radio" value="admin" onchange="toggleComplaintExtra(this.value)" required /> <span data-i18n="complaints.opt.admin">شكوى على
                  إداري</span></label>
              <label><input name="c-type" type="radio" value="player" onchange="toggleComplaintExtra(this.value)" required /> <span data-i18n="complaints.opt.player">شكوى على لاعب
                  زميل</span></label>
              <label><input name="c-type" type="radio" value="driver" onchange="toggleComplaintExtra(this.value)" required /> <span data-i18n="complaints.opt.driver">شكوى على
                  سائق</span></label>
              <label><input name="c-type" type="radio" value="other" onchange="toggleComplaintExtra(this.value)" required /> <span
                  data-i18n="complaints.opt.other">أخرى</span></label>
            </div>
            
            <div id="complaints-extra" style="display:none; margin-bottom:12px;">
              <label id="complaints-extra-label"></label>
              <input type="text" id="complaints-extra-input" />
            </div>
            
            <label data-i18n="complaints.details">تفاصيل الشكوى</label>'''
content = content.replace(old_complaints, new_complaints)

# 6. Add mapping text array to ar i18n
old_i18n_ar = """'btn.next_service': 'التالي',
        'btn.export_admin': 'تصدير البيانات (للاستخدام الإداري)'
      },"""
new_i18n_ar = """'btn.next_service': 'التالي',
        'btn.export_admin': 'تصدير البيانات (للاستخدام الإداري)',
        'form.branch': 'الفرع',
        'form.branch.select': '-- اختر الفرع --',
        'form.branch.fujairah': 'فرع الفجيرة',
        'form.branch.dibba': 'فرع دبا',
        'complaints.extra.bus': 'رقم الحافلة',
        'complaints.extra.coach': 'اسم المدرب',
        'complaints.extra.admin': 'اسم الإداري',
        'complaints.extra.player': 'اسم اللاعب',
        'complaints.extra.driver': 'اسم السائق'
      },"""
content = content.replace(old_i18n_ar, new_i18n_ar)

# 7. Add mapping text array to en i18n
old_i18n_en = """'btn.next_service': 'Next',
        'btn.export_admin': 'Export Data (For Admin Use)'
      }
    };"""
new_i18n_en = """'btn.next_service': 'Next',
        'btn.export_admin': 'Export Data (For Admin Use)',
        'form.branch': 'Branch',
        'form.branch.select': '-- Select Branch --',
        'form.branch.fujairah': 'Fujairah Branch',
        'form.branch.dibba': 'Dibba Branch',
        'complaints.extra.bus': 'Bus Number',
        'complaints.extra.coach': 'Coach Name',
        'complaints.extra.admin': 'Admin Name',
        'complaints.extra.player': 'Teammate Name',
        'complaints.extra.driver': 'Driver Name'
      }
    };"""
content = content.replace(old_i18n_en, new_i18n_en)

# 8. Add JS function toggleComplaintExtra
old_toggle_meeting = """window.toggleAdminName = function (val) {
      const el = document.getElementById('admin-name-container');
      if (el) {
        el.style.display = val === 'o6' ? 'block' : 'none';
      }
    }"""
new_toggle_meeting = """window.toggleAdminName = function (val) {
      const el = document.getElementById('admin-name-container');
      if (el) {
        el.style.display = val === 'o6' ? 'block' : 'none';
      }
    }

    window.toggleComplaintExtra = function (val) {
      const extraDiv = document.getElementById('complaints-extra');
      const extraLabel = document.getElementById('complaints-extra-label');
      const extraInput = document.getElementById('complaints-extra-input');
      
      const config = {
        'bus': 'complaints.extra.bus',
        'coach': 'complaints.extra.coach',
        'admin': 'complaints.extra.admin',
        'player': 'complaints.extra.player',
        'driver': 'complaints.extra.driver'
      };
      
      if (config[val]) {
        extraDiv.style.display = 'block';
        const labelKey = config[val];
        extraLabel.setAttribute('data-i18n', labelKey);
        if (i18n[msgLang] && i18n[msgLang][labelKey]) {
            extraLabel.textContent = i18n[msgLang][labelKey];
        }
        extraInput.setAttribute('required', 'true');
      } else {
        extraDiv.style.display = 'none';
        extraInput.removeAttribute('required');
        extraInput.value = '';
      }
    }"""
content = content.replace(old_toggle_meeting, new_toggle_meeting)

# 9. Modify getPersonal to include branch
old_get_personal = """function getPersonal() {
      return {
        fullName: document.getElementById('inq-name')?.value.trim() || '',
        phone: document.getElementById('inq-phone')?.value.trim() || '',
        email: document.getElementById('inq-email')?.value.trim() || '',
        playerName: document.getElementById('inq-player')?.value.trim() || '',
        sport: document.getElementById('inq-sport')?.value.trim() || '',
      };
    }"""
new_get_personal = """function getPersonal() {
      return {
        fullName: document.getElementById('inq-name')?.value.trim() || '',
        phone: document.getElementById('inq-phone')?.value.trim() || '',
        email: document.getElementById('inq-email')?.value.trim() || '',
        branch: document.getElementById('inq-branch')?.value.trim() || '',
        playerName: document.getElementById('inq-player')?.value.trim() || '',
        sport: document.getElementById('inq-sport')?.value.trim() || '',
      };
    }"""
content = content.replace(old_get_personal, new_get_personal)

# 10. Modify submitComplaint to include the extra field manually into details
old_submit_complaint = """const typeInput = document.querySelector('input[name="c-type"]:checked');
      const type = typeInput ? typeInput.nextElementSibling?.textContent.trim() : '';
      const details = document.getElementById('complaint-details')?.value.trim() || '';
      const entry = {"""
new_submit_complaint = """const typeInput = document.querySelector('input[name="c-type"]:checked');
      const type = typeInput ? typeInput.nextElementSibling?.textContent.trim() : '';
      let details = document.getElementById('complaint-details')?.value.trim() || '';
      
      if (typeInput && typeInput.value !== 'other') {
        const extraLabel = document.getElementById('complaints-extra-label')?.textContent || '';
        const extraValue = document.getElementById('complaints-extra-input')?.value.trim() || '';
        if (extraValue) {
            details = `${extraLabel}: ${extraValue}\\n\\n${details}`;
        }
      }
      
      const entry = {"""
content = content.replace(old_submit_complaint, new_submit_complaint)

# 11. Extract Call form branch in submitCall
old_submit_call = """const typeInput = document.querySelector('input[name="call-type"]:checked');
      const type = typeInput ? typeInput.nextElementSibling?.textContent.trim() : '';
      const notes = document.getElementById('call-notes')?.value.trim() || '';

      const entry = {"""
new_submit_call = """const typeInput = document.querySelector('input[name="call-type"]:checked');
      const type = typeInput ? typeInput.nextElementSibling?.textContent.trim() : '';
      const notes = document.getElementById('call-notes')?.value.trim() || '';
      const branch = document.getElementById('call-branch')?.value.trim() || '';

      const entry = {
        branch,"""
content = content.replace(old_submit_call, new_submit_call)

# 12. Extract building maintenance branch
old_submit_maint_b = """const items = Array.from(document.querySelectorAll('section#maintenance form:first-of-type .choices input[type="checkbox"]:checked')).map(i => i.nextElementSibling?.textContent.trim());
      const details = document.getElementById('maint-building-notes')?.value.trim() || '';
      const entry = {"""
new_submit_maint_b = """const items = Array.from(document.querySelectorAll('section#maintenance form:first-of-type .choices input[type="checkbox"]:checked')).map(i => i.nextElementSibling?.textContent.trim());
      const details = document.getElementById('maint-building-notes')?.value.trim() || '';
      const branch = document.getElementById('maint-b-branch')?.value.trim() || '';
      
      const entry = {
        branch,"""
content = content.replace(old_submit_maint_b, new_submit_maint_b)

# 13. Extract bus maintenance branch
old_submit_maint_bus = """const maintenanceType = typeSelect ? typeSelect.value : '';
      const details = document.getElementById('maint-bus-notes')?.value.trim() || '';
      const entry = {"""
new_submit_maint_bus = """const maintenanceType = typeSelect ? typeSelect.value : '';
      const details = document.getElementById('maint-bus-notes')?.value.trim() || '';
      const branch = document.getElementById('maint-bus-branch')?.value.trim() || '';
      
      const entry = {
        branch,"""
content = content.replace(old_submit_maint_bus, new_submit_maint_bus)


with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
