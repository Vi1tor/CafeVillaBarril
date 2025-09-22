const menuItems = [
            "Misto quente", "Queijo quente", "Pão francês", "Mussarela", "Presunto",
            "Queijo Minas", "Manteiga", "Requeijão", "Geleia", "Mel", "Pão de queijo",
            "Frutas da estação", "Bolo", "Achocolatado em pó", "Pamonha",
            "Leite", "Leite sem Lactose", "Suco de Laranja", "Iogurte", "Granola",
            "Café Coado", "Ovos Fritos", "Omelete", "Ovos Mexidos", 
            "Tapioca de Queijo minas", "Tapioca de presunto e queijo"
        ];

        const tableBody = document.querySelector('#itemsTable tbody');

        function populateItemsTable() {
            menuItems.forEach(item => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = item;
                row.appendChild(nameCell);

                for (let i = 0; i <= 2; i++) {
                    const qtyCell = document.createElement('td');
                    const radio = document.createElement('input');
                    const itemName = item.replace(/\s+/g, '_');

                    radio.type = 'radio';
                    radio.name = itemName;
                    radio.value = i;
                    radio.id = `${itemName}_${i}`;
                    if (i === 0) radio.checked = true;

                    const label = document.createElement('label');
                    label.htmlFor = radio.id;
                    label.textContent = i;

                    qtyCell.appendChild(radio);
                    qtyCell.appendChild(label);
                    row.appendChild(qtyCell);
                }

                tableBody.appendChild(row);
            });
        }

        function updateItemCount() {
            let totalCount = 0;
            menuItems.forEach(item => {
                const itemName = item.replace(/\s+/g, '_');
                const selectedRadio = document.querySelector(`input[name="${itemName}"]:checked`);
                if (selectedRadio && selectedRadio.value > 0) {
                    totalCount++;
                }
            });
            document.getElementById('totalCount').textContent = totalCount;
        }

        populateItemsTable();
        updateItemCount();

        menuItems.forEach(item => {
            const itemName = item.replace(/\s+/g, '_');
            document.querySelectorAll(`input[name="${itemName}"]`).forEach(radio => {
                radio.addEventListener('change', updateItemCount);
            });
        });

        document.getElementById('breakfastForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            submitBtn.disabled = true;

            const barrelNumber = document.getElementById('barrelNumber').value;
            const customerName = document.getElementById('customerName').value;
            const deliveryTime = document.getElementById('deliveryTime').value;
            const observations = document.getElementById('observations').value;

            let selectedItems = [];
            let totalCount = 0;

            menuItems.forEach(item => {
                const itemName = item.replace(/\s+/g, '_');
                const selectedRadio = document.querySelector(`input[name="${itemName}"]:checked`);
                if (selectedRadio && selectedRadio.value > 0) {
                    selectedItems.push(`➤ ${item}: ${selectedRadio.value}`);
                    totalCount++; // Conta apenas o item selecionado
                }
            });

            if (selectedItems.length === 0) {
                alert('Por favor, selecione pelo menos um item.');
                submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido';
                submitBtn.disabled = false;
                return;
            }

            const whatsappMessage = `*🍽️ NOVO PEDIDO DE CAFÉ DA MANHÃ* 🍞☕\n\n` +
                `*📍 Barril:* ${barrelNumber}\n` +
                `*👤 Responsável:* ${customerName}\n` +
                `*⏰ Horário de entrega:* ${deliveryTime}\n` +
                `*📊 Total de itens selecionados:* ${totalCount}\n\n` +
                `*📋 ITENS PEDIDOS:*\n${selectedItems.join('\n')}\n\n` +
                (observations ? `*📝 Observações:*\n${observations}\n\n` : '') +
                `_📅 Pedido registrado em ${new Date().toLocaleString('pt-BR')}_`;

            document.getElementById('generatedMessage').value = whatsappMessage;

            const adminNumber = "5535910172566";
            const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            document.getElementById('whatsappButton').href = whatsappUrl;

            try {
                const newWindow = window.open(whatsappUrl, '_blank');
                if (!newWindow) {
                    document.getElementById('whatsappLink').style.display = 'block';
                } else {
                    setTimeout(() => {
                        e.target.reset();
                        document.querySelectorAll('input[type="radio"][value="0"]').forEach(r => r.checked = true);
                        updateItemCount();
                    }, 2000);
                }
            } catch {
                document.getElementById('whatsappLink').style.display = 'block';
            }

            submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido';
            submitBtn.disabled = false;
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            const textarea = document.getElementById('generatedMessage');
            textarea.select();
            document.execCommand('copy');
            const msg = document.getElementById('copySuccess');
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        });