
import { Competency, CurriculumData, Topic } from './types';

export const COMPETENCIES_TC1: Competency[] = [
    { code: "1.1.TC1a", text: "Giải thích được nhu cầu thông tin." },
    { code: "1.1.TC1b", text: "Thực hiện được rõ ràng và theo quy trình các tìm kiếm để tìm dữ liệu, thông tin và nội dung trong môi trường số." },
    { code: "1.1.TC1c", text: "Giải thích được cách truy cập và điều hướng các kết quả tìm kiếm." },
    { code: "1.1.TC1d", text: "Giải thích được rõ ràng và theo quy trình chiến lược tìm kiếm." },
    { code: "1.2.TC1a", text: "Thực hiện phân tích, so sánh, đánh giá được độ tin cậy và độ chính xác của các nguồn dữ liệu, thông tin và nội dung số đã được tổ chức rõ ràng." },
    { code: "1.2.TC1b", text: "Thực hiện phân tích, diễn giải và đánh giá được dữ liệu, thông tin và nội dung số được xác định rõ ràng." },
    { code: "1.3.TC1a", text: "Lựa chọn được dữ liệu, thông tin và nội dung để tổ chức, lưu trữ và truy xuất chúng một cách thường xuyên trong môi trường số." },
    { code: "1.3.TC1b", text: "Sắp xếp được chúng một cách trật tự trong một môi trường có cấu trúc." },
    { code: "2.1.TC1a", text: "Thực hiện được các tương tác được xác định rõ ràng và thường xuyên with các công nghệ số." },
    { code: "2.1.TC1b", text: "Lựa chọn được các phương tiện giao tiếp số phù hợp, được xác định rõ ràng cho phù hợp với bối cảnh nhất định." },
    { code: "2.2.TC2a", text: "Lựa chọn các công nghệ số phù hợp được xác định rõ để trao đổi dữ liệu, thông tin và nội dung số." },
    { code: "2.2.TC2b", text: "Giải thích cách thức hoạt động như một trung gian để chia sẻ thông tin và nội dung thông qua các công nghệ kỹ thuật số được xác định rõ ràng và thường xuyên." },
    { code: "2.2.TC2c", text: "Minh họa rõ ràng và thường xuyên các phương pháp tham chiếu và ghi chú nguồn." },
    { code: "2.3.TC1a", text: "Lựa chọn được các dịch vụ số được xác định rõ ràng và phổ biến để tham gia vào xã hội." },
    { code: "2.3.TC1b", text: "Xác định được các công nghệ số rõ ràng và thích hợp để tự mình trang bị và tham gia vào xã hội như một công dân." },
    { code: "2.4.TC1a", text: "Lựa chọn được các công cụ và công nghệ số được xác định rõ ràng và thường xuyên cho các quá trình hợp tác." },
    { code: "2.5.TC1a", text: "Làm rõ được các chuẩn mực hành vi thường xuyên và được xác định rõ ràng cũng như bí quyết khi sử dụng công nghệ số và tương tác trong môi trường số." },
    { code: "2.5.TC1b", text: "Thể hiện được các chiến lược giao tiếp thường xuyên và xác định rõ ràng phương thức giao tiếp phù hợp trong môi trường số." },
    { code: "2.5.TC1c", text: "Mô tả các khía cạnh đa dạng về văn hóa và thế hệ được xác định rõ ràng và thông thường cần xem xét trong môi trường số." },
    { code: "2.6.TC1a", text: "Phân biệt được một loạt các danh tính số thông thường và được xác định rõ ràng." },
    { code: "2.6.TC1b", text: "Giải thích được những cách được xác định rõ ràng và thường xuyên để bảo vệ danh tiếng trực tuyến của bản thân." },
    { code: "2.6.TC1c", text: "Mô tả dữ liệu được xác định rõ ràng mà bạn thường xuyên thu được thông qua các công cụ, môi trường hoặc dịch vụ số." },
    { code: "3.1.TC1a", text: "Chỉ ra được cách tạo và chỉnh sửa nội dung có khái niệm cụ thể và mang tính phổ thông bằng những định dạng rõ ràng, phổ biến." },
    { code: "3.1.TC1b", text: "Thể hiện được bản thân thông qua việc tạo ra các nội dung số thông thường và được xác định rõ ràng." },
    { code: "3.2.TC1a", text: "Giải thích được các cách sửa đổi, tinh chỉnh, cải thiện và tích hợp các mục nội dung và thông tin mới được xác định rõ ràng để tạo ra những nội dung và thông tin mới và độc đáo." },
    { code: "3.3.TC1a", text: "Chỉ ra được các quy tắc thông thường và được xác định rõ ràng về bản quyền và giấy phép áp dụng cho dữ liệu, thông tin và nội dung số." },
    { code: "3.4.TC1a", text: "Liệt kê được các hướng dẫn thông thường và được xác định rõ ràng cho một hệ thống máy tính để giải quyết các vấn đề thường ngày hoặc thực hiện các tác vụ thường ngày." },
    { code: "4.1.TC1a", text: "Chỉ ra được những cách thức cơ bản và phổ biến để bảo vệ thiết bị và nội dung số." },
    { code: "4.1.TC1b", text: "Phân biệt được những rủi ro và mối đe dọa cơ bản và phổ biến trong môi trường số." },
    { code: "4.1.TC1c", text: "Chọn lựa được các biện pháp an toàn và bảo mật rõ ràng và thường xuyên." },
    { code: "4.1.TC1d", text: "Chỉ ra được những cách thức cơ bản và phổ biến để quan tâm đến mức độ tin cậy và quyền riêng tư." },
    { code: "4.2.TC1a", text: "Giải thích được các cách thức cơ bản và phổ biến để bảo vệ dữ liệu cá nhân và quyền riêng tư trong môi trường số." },
    { code: "4.2.TC1b", text: "Giải thích được các cách thức cơ bản và phổ biến để sử dụng và chia sẻ thông tin định danh cá nhân một cách an toàn." },
    { code: "4.2.TC1c", text: "Chỉ ra được các tuyên bố cơ bản và phổ biến trong chính sách quyền riêng tư về cách sử dụng dữ liệu cá nhân trong các dịch vụ số." },
    { code: "4.3.TC1a", text: "Giải thích được những cách thức cơ bản và phổ biến để tránh rủi ro và đe dọa đối với sức khỏe thể chất và tinh thần khi sử dụng công nghệ số." },
    { code: "4.3.TC1b", text: "Lựa chọn được những cách thức cơ bản và phổ biến để bảo vệ bản thân khỏi nguy cơ trong môi trường số." },
    { code: "4.3.TC1c", text: "Chỉ ra được những công nghệ số cơ bản và phổ biến giúp tăng cường thịnh vượng xã hội và sự hòa hợp trong xã hội." },
    { code: "4.4.TC1a", text: "Chỉ ra được những tác động cơ bản và phổ biến của công nghệ số và việc sử dụng công nghệ số đối với môi trường." },
    { code: "5.1.TC1a", text: "Chỉ ra được các vấn đề kỹ thuật thông thường và được xác định rõ ràng khi vận hành thiết bị và sử dụng môi trường số." },
    { code: "5.1.TC1b", text: "Chọn được các giải pháp được xác định rõ ràng và thông thường cho chúng." },
    { code: "5.2.TC1a", text: "Chỉ ra được những nhu cầu được xác định rõ ràng và thường xuyên." },
    { code: "5.2.TC1b", text: "Chọn được các công cụ số thông thường và được xác định rõ ràng cũng như các giải pháp công nghệ có thể có để giải quyết những nhu cầu đó." },
    { code: "5.2.TC1c", text: "Chọn được những cách thông thường và được xác định rõ ràng để điều chỉnh và tùy chỉnh môi trường số theo nhu cầu cá nhân." },
    { code: "5.3.TC1a", text: "Chọn được các công cụ và công nghệ số có thể được sử dụng để tạo ra kiến thức rõ ràng cũng như các quy trình và sản phẩm đổi mới được xác định rõ ràng." },
    { code: "5.3.TC1b", text: "Gắn kết được cá nhân và tập thể vào một số quá trình xử lý nhận thức để hiểu và giải quyết các vấn đề mang tính khái niệm và tình huống có vấn đề thông thường và được xác định rõ ràng trong môi trường số." },
    { code: "5.4.TC1a", text: "Giải thích được NLS của bản thân cần được cải thiện hoặc cập nhật ở đâu." },
    { code: "5.4.TC1b", text: "Chỉ ra được nơi để tìm kiếm các cơ hội được xác định rõ ràng để phát triển bản thân và cập nhật sự phát triển công nghệ số." },
    { code: "6.1.TC1a", text: "Giải thích được nguyên tắc hoạt động cơ bản của AI." },
    { code: "6.1.TC1b", text: "Diễn giải được các thuật ngữ và khái niệm liên quan đến AI." },
    { code: "6.2.TC1a", text: "Sử dụng được các công cụ AI trong công việc và học tập hàng ngày." },
    { code: "6.2.TC1b", text: "Thực hành được các kỹ năng sử dụng AI thông qua các bài tập và dự án nhỏ." },
    { code: "6.2.TC1c", text: "Xem xét các khía cạnh đạo đức khi sử dụng AI, bảo đảm không vi phạm quyền riêng tư và bảo mật dữ liệu." },
    { code: "6.3.TC1a", text: "Giải thích được cách thức hoạt động của các hệ thống AI đơn giản." },
    { code: "6.3.TC1b", text: "Tóm tắt được các đặc điểm và ứng dụng của hệ thống AI." }
];

export const COMPETENCIES_TC2: Competency[] = [
    { code: "1.1.TC2a", text: "Minh họa được nhu cầu thông tin." },
    { code: "1.1.TC2b", text: "Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số." },
    { code: "1.1.TC2c", text: "Mô tả được cách truy cập những dữ liệu, thông tin và nội dung này cũng như điều hướng giữa chúng." },
    { code: "1.1.TC2d", text: "Tổ chức được các chiến lược tìm kiếm." },
    { code: "1.2.TC2a", text: "Thực hiện phân tích, so sánh và đánh giá được các nguồn dữ liệu, thông tin và nội dung số." },
    { code: "1.2.TC2b", text: "Thực hiện phân tích, diễn giải và đánh giá được dữ liệu, thông tin và nội dung số." },
    { code: "1.3.TC2a", text: "Sắp xếp được thông tin, dữ liệu, nội dung để dễ dàng lưu trữ và truy xuất." },
    { code: "1.3.TC2b", text: "Tổ chức được thông tin, dữ liệu và nội dung trong một môi trường có cấu trúc." },
    { code: "2.1.TC2a", text: "Lựa chọn được nhiều công nghệ số để tương tác." },
    { code: "2.1.TC2b", text: "Lựa chọn được nhiều phương tiện truyền thông số cho phù hợp với bối cảnh nhất định." },
    { code: "2.2.TC2a", text: "Vận dụng được các công nghệ số phù hợp để chia sẻ dữ liệu, thông tin và nội dung số." },
    { code: "2.2.TC2b", text: "Giải thích được cách đóng vai trò trung gian để chia sẻ thông tin và nội dung thông qua công nghệ số." },
    { code: "2.2.TC2c", text: "Áp dụng được các phương pháp tham chiếu và ghi chú nguồn." },
    { code: "2.3.TC2a", text: "Lựa chọn được các dịch vụ số để tham gia vào xã hội." },
    { code: "2.3.TC2b", text: "Thảo luận về các công nghệ số phù hợp để nâng cao năng lực của bản thân và tham gia vào xã hội với tư cách là một công dân." },
    { code: "2.4.TC2a", text: "Lựa chọn được các công cụ và công nghệ số cho các quá trình hợp tác." },
    { code: "2.5.TC2a", text: "Thảo luận về các chuẩn mực hành vi và cách sử dụng công nghệ số và tương tác trong môi trường số." },
    { code: "2.5.TC2b", text: "Thảo luận các chiến lược giao tiếp phù hợp trong môi trường số." },
    { code: "2.5.TC2c", text: "Thảo luận các khía cạnh đa dạng về văn hóa và thế hệ cần xem xét trong môi trường số." },
    { code: "2.6.TC2a", text: "Hiển thị được nhiều danh tính số cụ thể." },
    { code: "2.6.TC2b", text: "Thảo luận những cách cụ thể để bảo vệ danh tiếng trực tuyến của bản thân." },
    { code: "2.6.TC2c", text: "Thao tác dữ liệu cá nhân tạo ra thông qua các công cụ, môi trường hoặc dịch vụ số." },
    { code: "3.1.TC2a", text: "Chỉ ra được cách tạo và chỉnh sửa nội dung ở các định dạng khác nhau." },
    { code: "3.1.TC2b", text: "Thể hiện được bản thân thông qua việc tạo ra các nội dung số." },
    { code: "3.2.TC2a", text: "Thảo luận các cách sửa đổi, tinh chỉnh, cải thiện và tích hợp nội dung và thông tin mới để tạo ra những nội dung và thông tin mới và độc đáo." },
    { code: "3.3.TC2a", text: "Thảo luận các quy tắc về bản quyền và giấy phép áp dụng cho thông tin và nội dung số." },
    { code: "3.4.TC2a", text: "Liệt kê được các hướng dẫn cho một hệ thống máy tính để giải quyết một vấn đề nhất định hoặc thực hiện một nhiệm vụ cụ thể." },
    { code: "4.1.TC2a", text: "Thiết lập được những cách thức bảo vệ thiết bị và nội dung số." },
    { code: "4.1.TC2b", text: "Phân biệt được rủi ro và mối đe dọa trong môi trường số." },
    { code: "4.1.TC2c", text: "Chọn lựa được các biện pháp an toàn và bảo mật." },
    { code: "4.1.TC2d", text: "Giải thích được các cách thức để quan tâm đến mức độ tin cậy và quyền riêng tư." },
    { code: "4.2.TC2a", text: "Thảo luận về cách bảo vệ dữ liệu cá nhân và quyền riêng tư trong môi trường số." },
    { code: "4.2.TC2b", text: "Thảo luận về cách sử dụng và chia sẻ thông tin định danh cá nhân một cách an toàn." },
    { code: "4.2.TC2c", text: "Chỉ ra được các tuyên bố trong chính sách quyền riêng tư về cách sử dụng dữ liệu cá nhân trong các dịch vụ số." },
    { code: "4.3.TC2a", text: "Giải thích được những cách thức để tránh những sự đe dọa liên quan đến việc sử dụng công nghệ số đối với sức khỏe thể chất và tinh thần." },
    { code: "4.3.TC2b", text: "Lựa chọn được cách thức bảo vệ bản thân và người khác khỏi nguy cơ trong môi trường số." },
    { code: "4.3.TC2c", text: "Thảo luận về những công nghệ số giúp tăng cường thịnh vượng xã hội và sự hòa hợp trong xã hội." },
    { code: "4.4.TC2a", text: "Thảo luận về các cách thức bảo vệ môi trường khỏi tác động của công nghệ số và việc sử dụng công nghệ số." },
    { code: "5.1.TC2a", text: "Phân biệt được các vấn đề kỹ thuật khi vận hành thiết bị và sử dụng môi trường số." },
    { code: "5.1.TC2b", text: "Chọn được giải pháp cho chúng." },
    { code: "5.2.TC2a", text: "Giải thích nhu cầu cá nhân." },
    { code: "5.2.TC2b", text: "Lựa chọn được các công cụ số và các giải pháp công nghệ có thể có để giải quyết những nhu cầu đó." },
    { code: "5.2.TC2c", text: "Chọn được cách điều chỉnh và tùy chỉnh môi trường số theo nhu cầu cá nhân." },
    { code: "5.3.TC2a", text: "Phân biệt được các công cụ và công nghệ số có thể được sử dụng để tạo ra kiến thức và đổi mới quy trình và sản phẩm." },
    { code: "5.3.TC2b", text: "Gắn kết được cá nhân và tập thể vào quá trình xử lý nhận thức để hiểu và giải quyết các vấn đề khái niệm và tình huống có vấn đề trong môi trường số." },
    { code: "5.4.TC2a", text: "Thảo luận về lĩnh vực NLS của bản thân cần được cải thiện hoặc cập nhật." },
    { code: "5.4.TC2b", text: "Chỉ ra được cách hỗ trợ người khác phát triển NLS của họ." },
    { code: "5.4.TC2c", text: "Chỉ ra được nơi để tìm kiếm cơ hội phát triển bản thân và cập nhật sự phát triển công nghệ số." },
    { code: "6.1.TC2a", text: "Áp dụng được các nguyên tắc cơ bản của AI để giải quyết vấn đề đơn giản." },
    { code: "6.1.TC2b", text: "Thực hiện được các thao tác cơ bản trên các công cụ AI." },
    { code: "6.2.TC2a", text: "Tối ưu hóa việc sử dụng các công cụ AI để đạt hiệu quả cao hơn." },
    { code: "6.2.TC2b", text: "Quản lý được việc triển khai các công cụ AI trong các dự án nhỏ." },
    { code: "6.2.TC2c", text: "Bảo vệ được dữ liệu cá nhân và tuân thủ các quy định pháp luật về bảo mật thông tin khi sử dụng AI." },
    { code: "6.3.TC2a", text: "Phân tích được hiệu quả của hệ thống AI trong việc giải quyết các vấn đề cụ thể." },
    { code: "6.3.TC2b", text: "So sánh được hiệu suất của các hệ thống AI khác nhau." }
];

export const CURRICULUM_DATA: CurriculumData = {
    "6": [
        { topic: "Chủ đề 1. Máy tính và cộng đồng", semester: 1, lessons: [
            { id: "6-1", title: "Bài 1. Thông tin và dữ liệu", yccd: [
                "Nhận biết được sự khác nhau giữa thông tin và dữ liệu.",
                "Phân biệt được thông tin và vật mang thông tin.",
                "Nêu được ví dụ minh họa tầm quan trọng của thông tin.",
                "Nêu được ví dụ minh họa giữa thông tin và dữ liệu."
            ], mappings: { 
                "1.1.TC1a": { selected: true, type: "manual", reason: "HS nêu được ví dụ minh họa tầm quan trọng của thông tin để giải thích nhu cầu thông tin trong đời sống." },
                "1.2.TC1b": { selected: true, type: "manual", reason: "HS phân biệt được thông tin và vật mang thông tin nhằm thực hiện phân tích, diễn giải và đánh giá được dữ liệu số xác định." }
            } },
            { id: "6-2", title: "Bài 2. Xử lí thông tin", yccd: [
                "Nêu được các bước cơ bản trong xử lí thông tin.",
                "Giải thích được máy tính là công cụ hiệu quả để xử lí thông tin. Nêu được ví dụ minh họa cụ thể."
            ], mappings: { 
                "5.2.TC1b": { selected: true, type: "manual", reason: "HS giải thích được máy tính là công cụ hiệu quả để xử lí thông tin nhằm chọn được các công cụ số phù hợp cho nhu cầu." }
            } },
            { id: "6-3", title: "Bài 3. Thông tin trong máy tính", yccd: [
                "Giải thích được việc có thể biểu diễn thông tin chỉ với hai kí hiệu 0 và 1.",
                "Biết được bit là đơn vị nhỏ nhất trong lưu trữ thông tin.",
                "Nêu được tên và độ lớn của các đơn vị đo dung lượng thông tin Byte, KB, MB, GB, quy đổi được một cách gần đúng giữa các đơn vị đo lường này.",
                "Ước lượng được khả năng lưu trữ của các thiết bị nhớ thông dụng như đĩa quang, đĩa từ, thẻ nhớ,...."
            ], mappings: { 
                "1.2.TC1b": { selected: true, type: "manual", reason: "HS giải thích được việc biểu diễn thông tin bằng hai kí hiệu 0 và 1 nhằm thực hiện phân tích và đánh giá dữ liệu số." },
                "5.2.TC1b": { selected: true, type: "manual", reason: "HS nêu được các đơn vị đo dung lượng thông tin để chọn được các công cụ số và giải pháp công nghệ lưu trữ phù hợp." }
            } }
        ]},
        { topic: "Chủ đề 2. Mạng máy tính và Internet", semester: 1, lessons: [
            { id: "6-4", title: "Bài 4. Mạng máy tính (t1)", yccd: [
                "Biết được mạng máy tính là gì và lợi ích của nó trong cuộc sống.",
                "Kể được tên những thành phần chính của một mạng máy tính."
            ], mappings: { 
                "2.1.TC1a": { selected: true, type: "manual", reason: "HS kể được tên những thành phần chính của mạng máy tính nhằm thực hiện các tương tác xác định với công nghệ số." },
                "5.1.TC1a": { selected: true, type: "manual", reason: "HS nhận biết mạng máy tính để chỉ ra các vấn đề kỹ thuật thông thường khi vận hành thiết bị kết nối." }
            } },
            { id: "6-5", title: "Kiểm tra giữa học kì I", yccd: ["Đánh giá kiến thức về thông tin, dữ liệu và mạng máy tính."], mappings: {} },
            { id: "6-6", title: "Bài 4. Mạng máy tính (t2)", yccd: [
                "Nêu được ví dụ cụ thể về trường hợp mạng không dây tiện dụng hơn mạng có dây."
            ], mappings: { 
                "5.2.TC1b": { selected: true, type: "manual", reason: "HS nêu được ví dụ cụ thể về mạng không dây để chọn được các giải pháp công nghệ phù hợp với nhu cầu kết nối." }
            } },
            { id: "6-7", title: "Bài 5. Internet", yccd: [
                "Biết Internet là gì.",
                "Biết được một số đặc điểm chính của Internet.",
                "Biết một số lợi ích chính của Internet."
            ], mappings: { 
                "2.1.TC1a": { selected: true, type: "manual", reason: "HS nhận biết đặc điểm Internet để thực hiện các tương tác xác định và thường xuyên trên môi trường mạng." }
            } }
        ]},
        { topic: "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính", semester: 1, lessons: [
            { id: "6-8", title: "Bài 15. Thuật toán", yccd: [
                "Diễn tả được sơ lược khái niệm của thuật toán, nêu được một vài ví dụ minh họa.",
                "Biết thuật toán có thể được mô tả dưới dạng liệt kê hoặc sơ đồ khối."
            ], mappings: { 
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS mô tả thuật toán bằng cách liệt kê để liệt kê được các hướng dẫn cho hệ thống máy tính giải quyết tác vụ." }
            } },
            { id: "6-9", title: "Bài 16. Các cấu trúc điều khiển", yccd: [
                "Biết các cấu trúc: Tuần tự, rẽ nhánh và lặp.",
                "Mô tả được thuật toán đơn giản có các cấu trúc tuần tự, rẽ nhánh và lặp dưới dạng liệt kê hoặc sơ đồ khối."
            ], mappings: { 
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS mô tả được thuật toán có các cấu trúc lặp, rẽ nhánh nhằm liệt kê các hướng dẫn cho hệ thống máy tính giải quyết vấn đề." }
            } },
            { id: "6-10", title: "Ôn tập học kì I", yccd: ["Hệ thống hóa kiến thức học kì I."], mappings: {} },
            { id: "6-11", title: "Kiểm tra cuối kì I", yccd: ["Đánh giá tổng kết học kì I."], mappings: {} },
            { id: "6-12", title: "Bài 17. Chương trình máy tính", yccd: [
                "Biết được chương trình là mô tả một thuật toán để máy tính “hiểu” và thực hiện được."
            ], mappings: { 
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS nhận biết chương trình là bản mô tả thuật toán nhằm liệt kê các hướng dẫn cho hệ thống máy tính thực hiện tác vụ." }
            } }
        ]},
        { topic: "Chủ đề 5. Ứng dụng tin học", semester: 2, lessons: [
            { id: "6-13", title: "Bài 10. Sơ đồ tư duy", yccd: [
                "Biết sắp xếp một cách logic và trình bày dưới dạng sơ đồ tư duy các ý tưởng, khái niệm.",
                "Tạo được sơ đồ tư duy đơn giản bằng phần mềm."
            ], mappings: { 
                "1.3.TC1b": { selected: true, type: "manual", reason: "HS sắp xếp logic các ý tưởng nhằm sắp xếp dữ liệu trật tự trong một môi trường có cấu trúc của sơ đồ tư duy." },
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS tạo được sơ đồ tư duy bằng phần mềm nhằm chỉ ra cách tạo và chỉnh sửa nội dung số định dạng phổ biến." }
            } },
            { id: "6-14", title: "Bài 11. Định dạng văn bản", yccd: [
                "Thực hiện được việc định dạng văn bản, trình bày trang văn bản và in."
            ], mappings: { 
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS thực hiện được việc định dạng văn bản nhằm chỉ ra cách tạo và chỉnh sửa nội dung số định dạng văn bản." }
            } },
            { id: "6-15", title: "Bài 12 & 13. Trình bày bảng & Tìm kiếm", yccd: [
                "Trình bày được thông tin ở dạng bảng bằng phần mềm soạn thảo văn bản.",
                "Sử dụng được công cụ tìm kiếm và thay thế của phần mềm."
            ], mappings: { 
                "1.1.TC1b": { selected: true, type: "manual", reason: "HS sử dụng công cụ tìm kiếm trong soạn thảo nhằm thực hiện theo quy trình tìm kiếm nội dung trong môi trường số." }
            } },
            { id: "6-16", title: "Bài 14. Thực hành tổng hợp: Sổ lưu niệm", yccd: [
                "Biết cách tổng hợp, sắp xếp các nội dung đã có thành một sản phẩm hoàn chỉnh."
            ], mappings: { 
                "3.2.TC1a": { selected: true, type: "manual", reason: "HS tổng hợp và sắp xếp nội dung sổ lưu niệm để giải thích cách tinh chỉnh và tích hợp các mục nội dung mới vào sản phẩm độc đáo." }
            } },
            { id: "6-17", title: "Kiểm tra giữa học kì II", yccd: ["Đánh giá kỹ năng soạn thảo và sơ đồ tư duy."], mappings: {} }
        ]},
        { topic: "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin", semester: 2, lessons: [
            { id: "6-18", title: "Bài 6. Mạng thông tin toàn cầu", yccd: [
                "Trình bày sơ lược được các khái niệm World Wide Web (WWW).",
                "Khai thác được thông tin trên một số trang Web thông dụng."
            ], mappings: { 
                "1.1.TC1d": { selected: true, type: "manual", reason: "HS khai thác thông tin trên web nhằm giải thích được rõ ràng chiến lược tìm kiếm thông tin theo quy trình." }
            } },
            { id: "6-19", title: "Bài 7. Tìm kiếm thông tin trên Internet", yccd: [
                "Thực hiện được việc tìm kiếm và khai thác thông tin trên Internet."
            ], mappings: { 
                "1.1.TC1b": { selected: true, type: "manual", reason: "HS thực hiện được việc tìm kiếm thông tin trên Internet nhằm thực hiện quy trình tìm dữ liệu trong môi trường số." }
            } }
        ]},
        { topic: "Chủ đề 4. Đạo đức, pháp luật và văn hóa trong môi trường số", semester: 2, lessons: [
            { id: "6-20", title: "Bài 9. An toàn thông tin trên Internet", yccd: [
                "Biết một số tác hại và nguy cơ khi sử dụng Internet.",
                "Bảo vệ được thông tin và tài khoản cá nhân."
            ], mappings: { 
                "4.1.TC1b": { selected: true, type: "manual", reason: "HS nhận biết tác hại và nguy cơ khi dùng Internet nhằm phân biệt rủi ro cơ bản và phổ biến trong môi trường số." },
                "4.1.TC1c": { selected: true, type: "manual", reason: "HS bảo vệ được thông tin và tài khoản cá nhân nhằm chọn lựa các biện pháp an toàn và bảo mật thường xuyên." }
            } },
            { id: "6-21", title: "Ôn tập cuối kì II", yccd: ["Ôn tập kiến thức HK2."], mappings: {} },
            { id: "6-22", title: "Kiểm tra cuối học kì II", yccd: ["Đánh giá tổng kết năm học."], mappings: {} },
            { id: "6-23", title: "Bài 8. Thư điện tử", yccd: [
                "Thực hiện được việc đăng nhập, soạn, gửi, đăng xuất hộp thư điện tử."
            ], mappings: { 
                "2.1.TC1a": { selected: true, type: "manual", reason: "HS soạn và gửi thư điện tử nhằm thực hiện các tương tác được xác định rõ ràng với công nghệ số." }
            } }
        ]}
    ],
    "7": [
        { topic: "Chủ đề 1: Máy tính và cộng đồng", semester: 1, lessons: [
            { id: "7-1", title: "Bài 1. Thiết bị vào ra", yccd: [
                "Biết và nhận ra được các thiết bị vào – ra có nhiều loại, hình dạng khác nhau, biết được chức năng của mỗi loại thiết bị này trong thu thập, lưu trữ, xử lí và truyền thông tin.",
                "Thực hiện đúng các thao tác với các thiết bị thông dụng của máy tính.",
                "Nêu được ví dụ cụ thể về những thao tác không đúng cách sẽ gây ra lỗi cho các thiết bị và hệ thống xử lí thông tin."
            ], mappings: {
                "5.1.TC1a": { selected: true, type: "manual", reason: "HS nêu được ví dụ cụ thể về thao tác sai gây lỗi thiết bị nhằm chỉ ra các vấn đề kỹ thuật thông thường khi vận hành thiết bị số." },
                "5.1.TC1b": { selected: true, type: "manual", reason: "HS thực hiện đúng các thao tác với thiết bị thông dụng nhằm chọn được các giải pháp được xác định rõ ràng cho các vấn đề vận hành." }
            } },
            { id: "7-2", title: "Bài 2. Phần mềm máy tính", yccd: [
                "Giải thích được sơ lược chức năng điều khiển và quản lí của hệ điều hành, qua đó phân biệt được hệ điều hành với phần mềm ứng dụng.",
                "Nêu được tên một số phần mềm ứng dụng đã sử dụng."
            ], mappings: {
                "5.2.TC1b": { selected: true, type: "manual", reason: "HS nêu được tên một số phần mềm ứng dụng đã sử dụng nhằm chọn được công cụ số phù hợp để giải quyết các nhu cầu cá nhân." }
            } },
            { id: "7-3", title: "Bài 3. Quản lý dữ liệu trong máy tính", yccd: [
                "Giải thích được phần mở rộng của tên tệp cho biết tệp thuộc loại gì, nêu được ví dụ minh hoạ.",
                "Thao tác thành thạo với tệp và thư mục: tạo, sao chép, di chuyển, đổi tên, xoá tệp và thư mục.",
                "Biết được tệp chương trình cũng là dữ liệu, có thể được lưu trữ trong máy tính.",
                "Nêu được ví dụ về biện pháp bảo vệ dữ liệu như sao lưu, phòng chống virus,..."
            ], mappings: {
                "1.3.TC1a": { selected: true, type: "manual", reason: "HS thao tác thành thạo với tệp và thư mục nhằm lựa chọn dữ liệu và nội dung để tổ chức, lưu trữ và truy xuất thường xuyên." },
                "1.3.TC1b": { selected: true, type: "manual", reason: "HS sắp xếp tệp và thư mục trật tự trong cấu trúc cây nhằm sắp xếp dữ liệu trật tự trong một môi trường có cấu trúc." },
                "4.1.TC1c": { selected: true, type: "manual", reason: "HS nêu được ví dụ về biện pháp bảo vệ dữ liệu nhằm chọn lựa các biện pháp an toàn và bảo mật số rõ ràng và thường xuyên." }
            } }
        ]},
        { topic: "Chủ đề 2: Tổ chức dữ liệu, tìm kiếm và trao đổi thông tin", semester: 1, lessons: [
            { id: "7-4", title: "Bài 4. Mạng xã hội và một số kênh trao đổi thông tin (t1)", yccd: [
                "Nêu được tên một kênh trao đổi thông tin thông dụng trên Internet và loại thông tin trao đổi trên đó.",
                "Nêu được một số chức năng cơ bản của MXH.",
                "Nêu được một số ví dụ truy cập không hợp lệ vào các nguồn thông tin và kênh truyền thông tin."
            ], mappings: {
                "2.1.TC1a": { selected: true, type: "manual", reason: "HS nêu được chức năng của mạng xã hội nhằm thực hiện các tương tác xác định và thường xuyên với các công nghệ số." },
                "4.1.TC1b": { selected: true, type: "manual", reason: "HS nêu được các ví dụ truy cập không hợp lệ nhằm phân biệt những rủi ro và mối đe dọa phổ biến trong môi trường số." }
            } },
            { id: "7-5", title: "KIỂM TRA GIỮA HỌC KỲ I", yccd: ["Đánh giá tổng hợp kiến thức từ Chủ đề 1 đến Chủ đề 2."], mappings: {} },
            { id: "7-6", title: "Bài 4. Mạng xã hội và một số kênh trao đổi thông tin (t2)", yccd: [
                "Thực hiện được giao tiếp qua mạng (trực tuyến hay không trực tuyến) theo đúng quy tắc và bằng ngôn ngữ lịch sự, thể hiện ứng xử có văn hoá.",
                "Biết được tác hại của bệnh nghiện Internet, từ đó có ý thức phòng tránh."
            ], mappings: {
                "2.5.TC1a": { selected: true, type: "manual", reason: "HS thực hiện giao tiếp qua mạng lịch sự và văn hóa nhằm làm rõ được các chuẩn mực hành vi thường xuyên khi sử dụng công nghệ số." },
                "2.5.TC1b": { selected: true, type: "manual", reason: "HS thực hiện giao tiếp qua mạng theo đúng quy tắc nhằm thể hiện được các chiến lược giao tiếp thường xuyên trong môi trường số." },
                "4.3.TC1a": { selected: true, type: "manual", reason: "HS nhận biết tác hại bệnh nghiện Internet nhằm giải thích các cách cơ bản để tránh rủi ro đối với sức khỏe tinh thần." }
            } }
        ]},
        { topic: "Chủ đề 3: Đạo đức, pháp luật và văn hóa trong môi trường số", semester: 1, lessons: [
            { id: "7-7", title: "Bài 5. Ứng xử trên mạng", yccd: [
                "Nêu được cách ứng xử hợp lí khi gặp trên mạng hoặc các kênh truyền thông tin số những thông tin có nội dung xấu, thông tin không phù hợp lứa tuổi.",
                "Biết nhờ người lớn giúp đỡ, tư vấn khi cần thiết, chẳng hạn khi bị bắt nạt trên mạng."
            ], mappings: {
                "4.3.TC1b": { selected: true, type: "manual", reason: "HS biết nhờ người lớn giúp đỡ khi bị bắt nạt nhằm lựa chọn được các cách thức cơ bản để bảo vệ bản thân khỏi nguy cơ số." },
                "2.5.TC1a": { selected: true, type: "manual", reason: "HS nêu được cách ứng xử hợp lí khi gặp nội dung xấu nhằm làm rõ chuẩn mực hành vi khi sử dụng và tương tác trong môi trường số." }
            } }
        ]},
        { topic: "Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính", semester: 1, lessons: [
            { id: "7-8", title: "Bài 14. Thuật toán tìm kiếm tuần tự", yccd: [
                "Giải thích được một vài thuật toán sắp xếp và tìm kiếm cơ bản, bằng các bước thủ công.",
                "Biểu diễn và mô phỏng được hoạt động của thuật toán đó trên một bộ dữ liệu vào có kích thước nhỏ."
            ], mappings: {
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS giải thích thuật toán bằng các bước thủ công nhằm liệt kê các hướng dẫn cho hệ thống máy tính giải quyết các vấn đề thường ngày." }
            } },
            { id: "7-9", title: "Bài 15. Tìm kiếm nhị phân", yccd: [
                "Hiểu và thực hiện được thuật toán tìm kiếm nhị phân.",
                "Mô phỏng hoạt động của thuật toán trên bộ dữ liệu cụ thể."
            ], mappings: {
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS thực hiện thuật toán tìm kiếm nhị phân nhằm liệt kê các hướng dẫn rõ ràng cho một hệ thống máy tính thực hiện tác vụ tìm kiếm." }
            } },
            { id: "7-10", title: "Ôn tập cuối kì I", yccd: ["Hệ thống hóa thuật toán và ứng dụng tin học học kỳ I."], mappings: {} },
            { id: "7-11", title: "KIỂM TRA CUỐI HỌC KỲ 1", yccd: ["Đánh giá tổng kết kiến thức học kỳ I."], mappings: {} },
            { id: "7-12", title: "Bài 16. Thuật toán sắp xếp", yccd: [
                "Giải thích được mối liên quan giữa sắp xếp và tìm kiếm, nêu được ví dụ minh hoạ.",
                "Nêu được ý nghĩa của việc chia một bài toán thành những bài toán nhỏ hơn."
            ], mappings: {
                "5.3.TC1b": { selected: true, type: "manual", reason: "HS chia nhỏ bài toán sắp xếp nhằm gắn kết cá nhân và tập thể vào quá trình xử lý nhận thức để giải quyết vấn đề mang tính khái niệm." }
            } }
        ]},
        { topic: "Chủ đề 4: Ứng dụng Tin học", semester: 2, lessons: [
            { id: "7-13", title: "Bài 6. Làm quen với phần mềm bảng tính", yccd: [
                "Nêu được một số chức năng cơ bản của phần mềm bảng tính.",
                "Thực hiện được một số thao tác đơn giản: chọn phông chữ, căn chỉnh dữ liệu, thay đổi độ rộng cột."
            ], mappings: {
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS thực hiện căn chỉnh dữ liệu ô tính nhằm chỉ ra cách tạo và chỉnh sửa nội dung số bằng những định dạng rõ ràng, phổ biến." }
            } },
            { id: "7-14", title: "Bài 7. Tính toán tự động trên bảng tính", yccd: [
                "Thực hiện được một số phép toán thông dụng, sử dụng được một số hàm đơn giản như MAX, MIN, SUM, AVERAGE, COUNT,...",
                "Sử dụng được công thức và dùng được địa chỉ trong công thức."
            ], mappings: {
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS sử dụng các hàm SUM, MAX, MIN trong công thức nhằm liệt kê các hướng dẫn cho hệ thống bảng tính thực hiện các tác vụ tính toán." }
            } },
            { id: "7-15", title: "Bài 8. Công cụ hỗ trợ tính toán", yccd: [
                "Sử dụng thành thạo các hàm tính toán cơ bản.",
                "Tạo được bảng tính có số liệu tính toán bằng công thức và hàm."
            ], mappings: {
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS tạo được bảng tính có số liệu tính toán nhằm chỉ ra cách tạo nội dung số bằng những định dạng phổ biến." },
                "5.2.TC1b": { selected: true, type: "manual", reason: "HS sử dụng thành thạo các hàm tính toán nhằm chọn được công cụ số xác định để giải quyết nhu cầu tính toán bảng biểu." }
            } },
            { id: "7-16", title: "Bài 9. Trình bày bảng tính (t1)", yccd: [
                "Giải thích được việc đưa các công thức vào bảng tính là một cách điều khiển tính toán tự động trên dữ liệu."
            ], mappings: {
                "3.4.TC1a": { selected: true, type: "manual", reason: "HS giải thích việc đưa công thức vào bảng tính nhằm liệt kê các hướng dẫn cho hệ thống máy tính thực hiện các tác vụ tự động." }
            } },
            { id: "7-17", title: "KIỂM TRA GIỮA HỌC KỲ II", yccd: ["Đánh giá kỹ năng bảng tính và bài học đầu kỳ II."], mappings: {} },
            { id: "7-18", title: "Bài 9. Trình bày bảng tính (t2)", yccd: [
                "Hoàn thiện kỹ năng định dạng và trình bày bảng tính chuyên nghiệp.",
                "Áp dụng các kiểu kẻ bảng và đổ màu nền hợp lý."
            ], mappings: {
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS áp dụng kẻ bảng và đổ màu nền nhằm chỉ ra cách tạo và chỉnh sửa nội dung số chuyên nghiệp bằng những định dạng phổ biến." }
            } },
            { id: "7-19", title: "Bài 10. Hoàn thiện bảng tính", yccd: [
                "Sử dụng được bảng tính điện tử để giải quyết một vài công việc cụ thể đơn giản."
            ], mappings: {
                "5.2.TC1b": { selected: true, type: "manual", reason: "HS sử dụng bảng tính điện tử để giải quyết công việc cụ thể nhằm chọn được giải pháp công nghệ có thể để giải quyết nhu cầu thực tế." }
            } },
            { id: "7-20", title: "Bài 11. Tạo bài trình chiếu", yccd: [
                "Nêu được một số chức năng cơ bản của phần mềm trình chiếu."
            ], mappings: {
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS nêu được chức năng phần mềm trình chiếu nhằm chỉ ra cách tạo nội dung số có khái niệm cụ thể bằng trang chiếu." }
            } },
            { id: "7-21", title: "Ôn tập cuối kì II", yccd: ["Tổng kết ứng dụng bảng tính và trình chiếu."], mappings: {} },
            { id: "7-22", title: "KIỂM TRA CUỐI HỌC KỲ II", yccd: ["Đánh giá kết quả học tập môn Tin học cả năm."], mappings: {} },
            { id: "7-23", title: "Bài 12. Định dạng đối tượng trên trang chiếu", yccd: [
                "Tạo được một báo cáo có tiêu đề, cấu trúc phân cấp, ảnh minh hoạ, hiệu ứng động.",
                "Biết sử dụng các định dạng cho văn bản, ảnh minh hoạ và hiệu ứng một cách hợp lí.",
                "Sao chép được dữ liệu từ tệp văn bản sang trang trình chiếu."
            ], mappings: {
                "3.1.TC1a": { selected: true, type: "manual", reason: "HS tạo báo cáo có cấu trúc và hiệu ứng trên trang chiếu nhằm thể hiện khả năng tạo và chỉnh sửa nội dung số định dạng phổ biến." },
                "3.2.TC1a": { selected: true, type: "manual", reason: "HS sao chép dữ liệu từ tệp văn bản sang trang trình chiếu nhằm giải thích cách tích hợp các mục nội dung mới vào sản phẩm độc đáo." }
            } }
        ]}
    ],
    "8": [
        { topic: "Chủ đề 1. Máy tính và cộng đồng", semester: 1, lessons: [
            { id: "8-1", title: "Bài 1. Lược sử công cụ tính toán", yccd: [
                "Trình bày được sơ lược lịch sử phát triển máy tính.",
                "Nêu được ví dụ cho thấy sự phát triển máy tính đã đem đến những thay đổi lớn lao cho xã hội loài người."
            ], mappings: {
                "5.3.TC2a": { selected: true, type: "manual", reason: "HS trình bày được sơ lược lịch sử phát triển máy tính để phân biệt các công cụ và công nghệ số qua các thời kỳ đã góp phần tạo ra kiến thức và đổi mới sản phẩm." },
                "2.3.TC2b": { selected: true, type: "manual", reason: "HS nêu được ví dụ về sự phát triển máy tính đem lại thay đổi xã hội nhằm thảo luận về các công nghệ số phù hợp nâng cao năng lực bản thân và hội nhập xã hội." }
            } }
        ]},
        { topic: "Chủ đề 2. Tổ chức, lưu trữ và kìm kiếm và trao đổi thông tin", semester: 1, lessons: [
            { id: "8-2", title: "Bài 2. Thông tin trong môi trường số", yccd: [
                "Nêu được các đặc điểm của thông tin số: đa dạng, được thu thập ngày càng nhanh và nhiều, được lưu trữ với dung lượng khổng lồ.",
                "Nêu được tính bản quyền, độ tin cậy và sự hiệu quả của các công cụ xử lý thông tin số.",
                "Trình bày được tầm quan trọng của việc khai thác các nguồn thông tin đáng tin cậy."
            ], mappings: {
                "1.2.TC2a": { selected: true, type: "manual", reason: "HS trình bày được tầm quan trọng của khai thác nguồn tin tin cậy nhằm thực hiện phân tích, so sánh và đánh giá các nguồn dữ liệu số." },
                "3.3.TC2a": { selected: true, type: "manual", reason: "HS nêu được tính bản quyền của thông tin số nhằm thảo luận các quy tắc về bản quyền và giấy phép áp dụng cho nội dung số." }
            } },
            { id: "8-3", title: "Bài 3. Thực hành khai thác thông tin số", yccd: [
                "Sử dụng được công cụ tìm kiếm, xử lí và trao đổi thông tin trong môi trường số.",
                "Chủ động tìm kiếm được thông tin để thực hiện nhiệm vụ cụ thể.",
                "Đánh giá được lợi ích của thông tin tìm được trong giải quyết vấn đề."
            ], mappings: {
                "1.1.TC2b": { selected: true, type: "manual", reason: "HS thực hiện tìm kiếm thông tin theo nhiệm vụ cụ thể nhằm tổ chức được việc tìm kiếm dữ liệu và nội dung trong môi trường số." },
                "1.2.TC2b": { selected: true, type: "manual", reason: "HS đánh giá được lợi ích của thông tin tìm được nhằm thực hiện phân tích, diễn giải và đánh giá giá trị của dữ liệu số." }
            } },
            { id: "8-4", title: "Ôn tập giữa kì I", yccd: ["Hệ thống kiến thức về lịch sử máy tính và thông tin số."], mappings: {} },
            { id: "8-5", title: "KIỂM TRA GIỮA HỌC KÌ I", yccd: ["Đánh giá tổng kết các kiến thức đã học đầu học kỳ I."], mappings: {} }
        ]},
        { topic: "CĐ 3. Đạo đức, pháp luật và văn hoá trong môi trường số hoá", semester: 1, lessons: [
            { id: "8-6", title: "Bài 4. Đạo đức pháp luật trong sử dụng công nghệ kĩ thuật số", yccd: [
                "Nhận biết và giải thích được một số biểu hiện vi phạm đạo đức và pháp luật khi sử dụng công nghệ số.",
                "Biết các ví dụ vi phạm bản quyền, thu âm, quay phim khi không được phép.",
                "Bảo đảm được các sản phẩm số do bản thân tạo ra thể hiện được đạo đức và không vi phạm pháp luật."
            ], mappings: {
                "2.5.TC2a": { selected: true, type: "manual", reason: "HS giải thích được các biểu hiện vi phạm đạo đức số nhằm thảo luận về các chuẩn mực hành vi và cách sử dụng công nghệ số văn minh." },
                "4.2.TC2a": { selected: true, type: "manual", reason: "HS bảo đảm được sản phẩm số do bản thân tạo ra không vi phạm pháp luật nhằm thảo luận cách bảo vệ dữ liệu cá nhân và quyền riêng tư." }
            } }
        ]},
        { topic: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính", semester: 1, lessons: [
            { id: "8-7", title: "Bài 12. Từ thuật toán đến chương trình", yccd: [
                "Mô tả được kịch bản đơn giản dưới dạng thuật toán và tạo được một chương trình đơn giản.",
                "Hiểu được chương trình là dãy các lệnh điều khiển máy tính thực hiện một thuật toán."
            ], mappings: {
                "3.4.TC2a": { selected: true, type: "manual", reason: "HS thực hiện tạo được một chương trình đơn giản nhằm liệt kê các hướng dẫn cho hệ thống máy tính giải quyết một nhiệm vụ cụ thể." }
            } },
            { id: "8-8", title: "Bài 13. Biểu diễn dữ liệu", yccd: [
                "Nêu được khái niệm hằng, biến, kiểu dữ liệu, biểu thức.",
                "Sử dụng được các khái niệm hằng, biến trong các chương trình đơn giản của môi trường lập trình trực quan."
            ], mappings: {
                "3.1.TC2a": { selected: true, type: "manual", reason: "HS sử dụng được các hằng và biến trong chương trình nhằm chỉ ra cách tạo và chỉnh sửa nội dung ở các định dạng lập trình số." }
            } },
            { id: "8-9", title: "Bài 14. Cấu trúc điều khiển", yccd: [
                "Thể hiện được cấu trúc tuần tự trong môi trường lập trình trực quan.",
                "Thể hiện được cấu trúc rẽ nhánh và cấu trúc lặp trong chương trình."
            ], mappings: {
                "3.4.TC2a": { selected: true, type: "manual", reason: "HS thể hiện được cấu trúc rẽ nhánh và lặp trong chương trình nhằm liệt kê các hướng dẫn cho máy tính thực hiện tác vụ cụ thể." }
            } },
            { id: "8-10", title: "Ôn tập GHK1", yccd: ["Hệ thống tư duy thuật toán và lập trình căn bản."], mappings: {} },
            { id: "8-11", title: "Kiểm tra GHK1", yccd: ["Đánh giá kỹ năng thiết kế chương trình đơn giản."], mappings: {} },
            { id: "8-12", title: "Bài 15. Gỡ lỗi", yccd: ["Chạy thử, tìm lỗi và sửa được lỗi cho chương trình."], mappings: {
                "5.1.TC2a": { selected: true, type: "manual", reason: "HS thực hiện chạy thử và tìm lỗi cho chương trình nhằm phân biệt các vấn đề kỹ thuật khi vận hành môi trường lập trình số." },
                "5.1.TC2b": { selected: true, type: "manual", reason: "HS thực hiện sửa được lỗi cho chương trình nhằm chọn được giải pháp khắc phục sự cố kỹ thuật trong môi trường số." }
            } }
        ]},
        { topic: "Chủ đề 6. Hướng nghiệp với Tin học", semester: 2, lessons: [
            { id: "8-13", title: "Bài 16. Tin học với nghề nghiệp", yccd: [
                "Nêu được một số nghề nghiệp mà ứng dụng tin học sẽ làm tăng hiệu quả công việc.",
                "Nêu được tên một số nghề thuộc lĩnh vực tin học.",
                "Nhận thức và trình bày được vấn đề bình đẳng giới trong ứng dụng tin học."
            ], mappings: {
                "5.4.TC2a": { selected: true, type: "manual", reason: "HS trình bày được vấn đề bình đẳng giới trong tin học nhằm thảo luận về lĩnh vực NLS của bản thân cần được cải thiện hoặc cập nhật cho nghề nghiệp tương lai." }
            } }
        ]},
        { topic: "Chủ đề 4. Ứng dụng Tin học", semester: 2, lessons: [
            { id: "8-14", title: "Bài 5. Sử dụng bảng tính giải quyết bài toán thực tế", yccd: [
                "Giải thích được sự khác nhau giữa địa chỉ tương đối và địa chỉ tuyệt đối.",
                "Giải thích được sự thay đổi địa chỉ tương đối khi sao chép công thức.",
                "Sử dụng phần mềm bảng tính giải quyết bài toán thực tế.",
                "Sao chép dữ liệu từ các tệp văn bản sang trang tính."
            ], mappings: {
                "5.2.TC2b": { selected: true, type: "manual", reason: "HS sử dụng được bảng tính để giải quyết bài toán thực tế nhằm lựa chọn công cụ số và giải pháp công nghệ để giải quyết nhu cầu." },
                "3.2.TC2a": { selected: true, type: "manual", reason: "HS thực hiện sao chép dữ liệu từ tệp văn bản sang trang tính nhằm thảo luận cách tích hợp thông tin mới tạo ra nội dung số độc đáo." }
            } },
            { id: "8-15", title: "Bài 6. Sắp xếp và lọc dữ liệu", yccd: [
                "Sử dụng được phần mềm bảng tính trợ giúp giải quyết bài toán thực tế.",
                "Nêu được các tình huống thực tế cần lọc và sắp xếp dữ liệu.",
                "Thực hiện thành thạo thao tác lọc và sắp xếp."
            ], mappings: {
                "1.3.TC2a": { selected: true, type: "manual", reason: "HS thực hiện thao tác lọc và sắp xếp dữ liệu nhằm sắp xếp dữ liệu bảng tính để dễ dàng lưu trữ và truy xuất." }
            } },
            { id: "8-16", title: "Bài 7. Trình bày dữ liệu bằng biểu đồ", yccd: [
                "Nêu được một số tình huống thực tế cần sử dụng biểu đồ.",
                "Thực hiện được thao tác tạo biểu đồ của bảng tính."
            ], mappings: {
                "3.1.TC2a": { selected: true, type: "manual", reason: "HS thực hiện thao tác tạo biểu đồ nhằm chỉ ra cách tạo và chỉnh sửa nội dung số ở các định dạng trực quan khác nhau." }
            } },
            { id: "8-17", title: "Ôn tập giữa kì II", yccd: ["Hệ thống kỹ năng bảng tính và lọc dữ liệu."], mappings: {} },
            { id: "8-18", title: "KTGHK2", yccd: ["Đánh giá năng lực sử dụng bảng tính giải quyết bài toán."], mappings: {} }
        ]},
        { topic: "Chủ đề 4a. Soạn thảo văn bản và trình chiếu nâng cao", semester: 2, lessons: [
            { id: "8-19", title: "Bài 8a. Làm việc với danh sách liệt kê và hình ảnh", yccd: [
                "Thực hiện các thao tác: chèn thêm, xoá bỏ, co dãn hình ảnh.",
                "Vẽ hình đồ hoạ trong văn bản.",
                "Tạo danh sách dạng liệt kê chuyên nghiệp."
            ], mappings: {
                "3.1.TC2b": { selected: true, type: "manual", reason: "HS thực hiện vẽ hình đồ họa và tạo danh sách liệt kê nhằm thể hiện bản thân thông qua việc tạo ra các nội dung văn bản số chuyên nghiệp." }
            } },
            { id: "8-20", title: "Bài 9a. Tạo đầu trang, chân trang cho văn bản", yccd: ["Thực hiện được thao tác đánh số trang, thêm đầu trang (header) và chân trang (footer)."], mappings: {
                "3.1.TC2a": { selected: true, type: "manual", reason: "HS thực hiện thêm đầu trang và chân trang nhằm chỉ ra cách tạo và chỉnh sửa nội dung văn bản ở các định dạng cấu trúc khác nhau." }
            } },
            { id: "8-21", title: "Bài 10a. Định dạng nâng cao cho trang chiếu", yccd: [
                "Chọn đặt màu sắc, cỡ chữ hài hoà và hợp lí với nội dung.",
                "Thực hiện thao tác đánh số trang, thêm đầu trang và chân trang cho trang chiếu."
            ], mappings: {
                "3.1.TC2b": { selected: true, type: "manual", reason: "HS thực hiện chọn đặt màu sắc hài hòa cho trang chiếu nhằm thể hiện bản thân qua việc tạo ra các nội dung trình chiếu thẩm mỹ." }
            } },
            { id: "8-22", title: "Ôn tập HK2", yccd: ["Tổng kết ứng dụng văn bản và trình chiếu nâng cao."], mappings: {} },
            { id: "8-23", title: "KTHK2", yccd: ["Đánh giá kỹ năng hoàn thiện văn bản và bài trình chiếu."], mappings: {} },
            { id: "8-24", title: "Bài 11a. Sử dụng bản mẫu cho bài trình chiếu", yccd: [
                "Sử dụng được các bản mẫu (template) tạo bài trình chiếu.",
                "Nhúng được vào trang chiếu đường dẫn đến video hay tài liệu.",
                "Tạo sản phẩm văn bản có tính thẩm mĩ phục vụ thực tế."
            ], mappings: {
                "5.2.TC2c": { selected: true, type: "manual", reason: "HS thực hiện sử dụng bản mẫu trình chiếu nhằm chọn cách điều chỉnh và tùy chỉnh môi trường số theo nhu cầu và thẩm mỹ cá nhân." },
                "3.2.TC2a": { selected: true, type: "manual", reason: "HS thực hiện nhúng đường dẫn video vào bài chiếu nhằm thảo luận cách tích hợp thông tin mới để tạo ra nội dung số độc đáo." }
            } }
        ]}
    ],
    "9": [
        { topic: "Chủ đề 1. Thế giới kĩ thuật số", semester: 1, lessons: [
            { id: "9-1", title: "Bài 1. Thế giới kĩ thuật số", yccd: [
                "Nhận biết được sự có mặt của các thiết bị có gắn bộ xử lí thông tin ở khắp nơi.",
                "Nêu được khả năng của máy tính và chỉ ra được một số ứng dụng thực tế của nó trong khoa học kĩ thuật và đời sống.",
                "Giải thích được tác động của công nghệ thông tin lên giáo dục và xã hội thông qua các ví dụ cụ thể."
            ], mappings: {
                "5.3.TC2a": { selected: true, type: "manual", reason: "HS giải thích được tác động của CNTT qua các ví dụ cụ thể nhằm phân biệt các công cụ và công nghệ số dùng để tạo ra kiến thức và đổi mới sản phẩm." }
            } }
        ]},
        { topic: "Chủ đề 2. Tổ chức, lưu trữ và tìm kiếm thông tin", semester: 1, lessons: [
            { id: "9-2", title: "Bài 2. Thông tin trong giải quyết vấn đề", yccd: [
                "Giải thích được sự cần thiết phải quan tâm đến chất lượng thông tin khi tìm kiếm, tiếp nhận và trao đổi.",
                "Giải thích được tính mới, tính chính xác, tính đầy đủ, tính sử dụng được của thông tin."
            ], mappings: {
                "1.2.TC2a": { selected: true, type: "manual", reason: "HS giải thích được sự cần thiết của chất lượng thông tin nhằm thực hiện phân tích và đánh giá được độ tin cậy của các nguồn dữ liệu số." }
            } },
            { id: "9-3", title: "Bài 3. Thực hành: Đánh giá chất lượng thông tin", yccd: [
                "Biết cách tìm kiếm được thông tin để giải quyết vấn đề.",
                "Đánh giá được chất lượng thông tin trong giải quyết vấn đề."
            ], mappings: {
                "1.1.TC2b": { selected: true, type: "manual", reason: "HS thực hiện tìm kiếm thông tin theo vấn đề cụ thể nhằm tổ chức được việc tìm kiếm dữ liệu và nội dung trong môi trường số." },
                "1.2.TC2b": { selected: true, type: "manual", reason: "HS thực hiện đánh giá chất lượng thông tin thu được nhằm thực hiện phân tích, diễn giải và đánh giá giá trị của dữ liệu số." }
            } }
        ]},
        { topic: "Chủ đề 3. Đạo đức, pháp luật và văn hoá", semester: 1, lessons: [
            { id: "9-4", title: "Bài 4. Một số vấn đề pháp lí về sử dụng Internet", yccd: [
                "Trình bày được tác động tiêu cực của công nghệ kĩ thuật số đối với đời sống.",
                "Nêu được một số nội dung liên quan đến luật Công nghệ thông tin."
            ], mappings: {
                "2.5.TC2a": { selected: true, type: "manual", reason: "HS trình bày được các tác động tiêu cực của công nghệ số nhằm thảo luận về các chuẩn mực hành vi và cách tương tác an toàn trong môi trường số." },
                "4.1.TC2b": { selected: true, type: "manual", reason: "HS nêu được một số nội dung luật CNTT nhằm phân biệt rủi ro và mối đe dọa trong môi trường số và thực thi đúng quy định." }
            } },
            { id: "9-5", title: "Ôn tập Giữa học kỳ I", yccd: ["Củng cố kiến thức về thế giới kỹ thuật số và chất lượng thông tin."], mappings: {} },
            { id: "9-6", title: "Kiểm tra Giữa học kỳ I", yccd: ["Đánh giá nhận thức về tác động của CNTT và quản lý thông tin."], mappings: {} }
        ]},
        { topic: "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính", semester: 1, lessons: [
            { id: "9-7", title: "Bài 14. Giải quyết vấn đề", yccd: ["Trình bày được quá trình giải quyết vấn đề và mô tả được giải pháp dưới dạng thuật toán."], mappings: {
                "3.4.TC2a": { selected: true, type: "manual", reason: "HS mô tả được giải pháp dưới dạng thuật toán nhằm liệt kê được các hướng dẫn cho hệ thống máy tính giải quyết một vấn đề nhất định." }
            } },
            { id: "9-8", title: "Bài 15. Bài toán tin học", yccd: [
                "Giải thích được khái niệm bài toán trong tin học.",
                "Nêu được quy trình con người giao bài toán cho máy tính giải quyết."
            ], mappings: {
                "5.3.TC2b": { selected: true, type: "manual", reason: "HS giải thích được quy trình giao bài toán cho máy tính nhằm gắn kết cá nhân vào quá trình xử lý nhận thức để hiểu và giải quyết vấn đề trong môi trường số." }
            } },
            { id: "9-9", title: "Bài 16. Thực hành: Lập chương trình máy tính", yccd: [
                "Sử dụng được cấu trúc tuần tự, rẽ nhánh, lặp trong mô tả thuật toán.",
                "Giải thích được chương trình là bản mô tả thuật toán bằng ngôn ngữ máy."
            ], mappings: {
                "3.4.TC2a": { selected: true, type: "manual", reason: "HS giải thích được chương trình là bản mô tả thuật toán nhằm liệt kê được các hướng dẫn rõ ràng cho máy tính thực hiện nhiệm vụ cụ thể." }
            } },
            { id: "9-10", title: "Ôn tập Học kỳ I", yccd: ["Hệ thống tư duy lập trình và bài toán tin học."], mappings: {} },
            { id: "9-11", title: "Kiểm tra Cuối học kỳ I", yccd: ["Đánh giá kỹ năng giải quyết vấn đề bằng máy tính."], mappings: {} }
        ]},
        { topic: "Chủ đề 4. Ứng dụng Tin học", semester: 2, lessons: [
            { id: "9-12", title: "Bài 5. Tìm hiểu phần mềm mô phỏng", yccd: [
                "Nêu được ví dụ phần mềm mô phỏng.",
                "Nêu được những kiến thức đã thu nhận từ việc khai thác phần mềm mô phỏng."
            ], mappings: {
                "5.2.TC2b": { selected: true, type: "manual", reason: "HS nêu được ví dụ phần mềm mô phỏng nhằm lựa chọn các công cụ số và giải pháp công nghệ có thể để giải quyết nhu cầu khám phá tri thức." }
            } },
            { id: "9-13", title: "Bài 6. Thực hành: Khai thác phần mềm mô phỏng", yccd: ["Nhận biết sự mô phỏng thế giới thực giúp con người khám phá tri thức và giải quyết vấn đề."], mappings: {
                "5.3.TC2a": { selected: true, type: "manual", reason: "HS thực hiện khai thác phần mềm mô phỏng nhằm phân biệt các công cụ số được sử dụng để tạo ra kiến thức và đổi mới quy trình khám phá thế giới." }
            } },
            { id: "9-14", title: "Bài 7. Trình bày thông tin trong trao đổi và hợp tác", yccd: [
                "Sử dụng được bài trình bày và sơ đồ tư duy trong trao đổi thông tin.",
                "Biết khả năng đính kèm tệp đa phương tiện vào sơ đồ tư duy."
            ], mappings: {
                "2.2.TC2a": { selected: true, type: "manual", reason: "HS thực hiện sử dụng bài trình bày và sơ đồ tư duy nhằm vận dụng các công nghệ số phù hợp để chia sẻ nội dung và thông tin số." },
                "2.4.TC2a": { selected: true, type: "manual", reason: "HS thực hiện trao đổi thông tin nhóm qua sơ đồ tư duy nhằm lựa chọn các công cụ số hiệu quả cho các quá trình hợp tác." }
            } },
            { id: "9-15", title: "Bài 8. Thực hành: Sử dụng công cụ trực quan", yccd: ["Tạo được sơ đồ tư duy và bài trình chiếu chuyên nghiệp có sử dụng video, hình ảnh hợp lý."], mappings: {
                "3.1.TC2b": { selected: true, type: "manual", reason: "HS thực hiện tạo bài trình chiếu chuyên nghiệp nhằm thể hiện bản thân thông qua việc tạo ra các sản phẩm nội dung số trực quan và sinh động." }
            } }
        ]},
        { topic: "Chủ đề 4a. Sử dụng bảng tính điện tử nâng cao", semester: 2, lessons: [
            { id: "9-16", title: "Bài 9a. Sử dụng công cụ xác thực dữ liệu", yccd: ["Thực hiện được công cụ xác thực dữ liệu (Data Validation) để giải quyết bài toán quản lý tài chính."], mappings: {
                "1.3.TC2b": { selected: true, type: "manual", reason: "HS thực hiện được công cụ xác thực dữ liệu nhằm tổ chức thông tin, dữ liệu trong một môi trường bảng tính có cấu trúc chặt chẽ." }
            } },
            { id: "9-17", title: "Bài 10a. Sử dụng hàm Countif", yccd: ["Thực hiện thao tác hàm đếm theo điều kiện Countif trong giải quyết bài toán quản lý tài chính."], mappings: {
                "5.2.TC2b": { selected: true, type: "manual", reason: "HS thực hiện thao tác hàm Countif nhằm lựa chọn các công cụ và giải pháp bảng tính phù hợp để giải quyết nhu cầu thống kê số liệu." }
            } },
            { id: "9-18", title: "Bài 11a. Sử dụng hàm Sumif", yccd: ["Thực hiện thao tác hàm tính tổng theo điều kiện Sumif để giải quyết bài toán quản lý gia đình."], mappings: {
                "5.2.TC2b": { selected: true, type: "manual", reason: "HS thực hiện thao tác hàm Sumif nhằm lựa chọn công cụ số phù hợp giải quyết nhu cầu tính toán có điều kiện trong thực tế." }
            } },
            { id: "9-19", title: "Bài 12a. Sử dụng hàm If", yccd: ["Thực hiện thao tác hàm điều kiện If để giải quyết bài toán quản lý gia đình."], mappings: {
                "3.4.TC2a": { selected: true, type: "manual", reason: "HS thực hiện thao tác hàm điều kiện If nhằm liệt kê được các hướng dẫn logic cho bảng tính thực hiện giải quyết bài toán cụ thể." }
            } },
            { id: "9-20", title: "Thực hành tổng hợp", yccd: ["Tổng hợp kỹ năng sử dụng các hàm If, Sumif, Countif và xác thực dữ liệu."], mappings: {
                "3.1.TC2a": { selected: true, type: "manual", reason: "HS thực hiện tổng hợp các kỹ năng hàm bảng tính nhằm chỉ ra cách tạo và chỉnh sửa nội dung quản lý số chuyên sâu ở nhiều định dạng." }
            } },
            { id: "9-21", title: "Bài 13a. Hoàn thiện bảng tính quản lý tài chính", yccd: ["Tạo được trang tính tổng hợp và hoàn thiện bảng tính quản lý tài chính gia đình."], mappings: {
                "1.3.TC2a": { selected: true, type: "manual", reason: "HS thực hiện hoàn thiện bảng tính tổng hợp nhằm sắp xếp thông tin, dữ liệu để dễ dàng lưu trữ và truy xuất cho quản lý lâu dài." }
            } },
            { id: "9-22", title: "Ôn tập Học kỳ II", yccd: ["Hệ thống toàn bộ hàm bảng tính nâng cao và quản lý dữ liệu gia đình."], mappings: {} },
            { id: "9-23", title: "Kiểm tra Cuối học kỳ II", yccd: ["Đánh giá tổng kết kỹ năng bảng tính nâng cao cả học kỳ II."], mappings: {} }
        ]},
        { topic: "Chủ đề 6. Hướng nghiệp với Tin học", semester: 2, lessons: [
            { id: "9-24", title: "Bài 17. Tin học và thế giới nghề nghiệp", yccd: [
                "Trình bày được công việc đặc thù và sản phẩm chính của người làm tin học trong ít nhất ba nhóm nghề.",
                "Nhận biết được đặc trưng cơ bản của nhóm nghề thuộc hướng Tin học ứng dụng và Khoa học máy tính.",
                "Giải thích được vấn đề bình đẳng giới trong lĩnh vực tin học."
            ], mappings: {
                "5.4.TC2a": { selected: true, type: "manual", reason: "HS trình bày được công việc đặc thù các nhóm nghề tin học nhằm thảo luận về lĩnh vực NLS của bản thân cần được cải thiện hoặc cập nhật." }
            } }
        ] }
    ]
};
