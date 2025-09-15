// /** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { humanNumber } from "@web/core/utils/numbers";
import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.NewTicket = publicWidget.Widget.extend({
    selector: "form[action='/submitted/ticket']",

    events: {
        'change input[name="attachment"]': "_onChangeAttachment",
        'input input#subject': "_onInputSubject",
    },

    /**
     * Cache các phần tử cần dùng và khởi tạo bộ đếm ký tự tiêu đề
     */
    start() {
        this.attachmentInput = this.el.querySelector("#attachment");
        this.infoEl = this.el.querySelector("#attachment_information");
        this.fileListEl = this.el.querySelector("#file_list");
        this.subjectEl = this.el.querySelector("#subject");
        this.counterEl = this.el.querySelector("#subject_counter");
        this._updateSubjectCounter();
        return this._super(...arguments);
    },

    // ===== Subject counter =====
    _onInputSubject() {
        this._updateSubjectCounter();
    },
    _updateSubjectCounter() {
        if (!this.subjectEl || !this.counterEl) return;
        const len = (this.subjectEl.value || "").length;
        const max = parseInt(this.subjectEl.getAttribute("maxlength") || "100", 10);
        this.counterEl.textContent = `${len}/${max}`;
    },

    // ===== Attachments =====
    _onChangeAttachment(ev) {
        ev.preventDefault();
        const attachment_input = this.attachmentInput || ev.currentTarget;
        if (!attachment_input) return;

        const info = this.infoEl;
        const list = this.fileListEl;

        // Reset UI
        if (info) {
            info.style.display = "none";
            info.textContent = "";
        }
        if (list) {
            list.style.display = "none";
            list.textContent = "";
        }

        // max_upload_size từ template (bytes)
        // Trong giao diện bạn đang dùng, đây là GIỚI HẠN TỔNG các file (hint hiển thị “tổng các file”).
        // Ta vẫn chặn thêm từng file nếu vượt quá limit này để tránh up nhầm.
        const max_upload_size = parseInt(attachment_input.getAttribute("max_upload_size") || "0", 10);

        const dt = new DataTransfer();
        let totalSize = 0;
        const acceptedNames = [];
        let perFileViolated = false;

        for (const file of attachment_input.files) {
            totalSize += file.size;

            if (max_upload_size && file.size > max_upload_size) {
                // Thông báo từng file vượt quá giới hạn
                perFileViolated = true;
                if (info) {
                    const line = _t(
                        "The selected file (%sB) is over the maximum allowed file size (%sB).",
                        humanNumber(file.size),
                        humanNumber(max_upload_size)
                    );
                    info.textContent = info.textContent ? `${info.textContent}\n${line}` : line;
                }
                // Không thêm file này vào danh sách gửi
                continue;
            }

            dt.items.add(file);
            acceptedNames.push(file.name);
        }

        // Gán lại files (đã loại file quá lớn)
        attachment_input.files = dt.files;

        // Hiển thị danh sách file đã chọn
        if (acceptedNames.length && list) {
            list.style.display = "block";
            list.textContent = _t("Selected: %s", acceptedNames.join(", "));
        }

        // Cảnh báo tổng dung lượng
        if (max_upload_size && totalSize > max_upload_size) {
            if (info) {
                const totalMsg = _t(
                    "Total size (%sB) exceeds the maximum allowed (%sB). Please remove some files or compress them.",
                    humanNumber(totalSize),
                    humanNumber(max_upload_size)
                );
                info.textContent = info.textContent
                    ? `${info.textContent}\n${totalMsg}`
                    : totalMsg;
                info.style.display = "";
            }
        } else if (perFileViolated && info) {
            // Nếu chỉ vi phạm theo-file, vẫn phải hiện block thông báo
            info.style.display = "";
        }
    },
});

export default publicWidget.registry.NewTicket;
