FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS production

RUN addgroup --gid 1001 pygroup && \
    adduser --uid 1001 --gid 1001 --no-create-home pyuser

WORKDIR /app

COPY --from=builder /root/.local /home/pyuser/.local
COPY --chown=pyuser:pygroup . .

USER pyuser

ENV PATH=/home/pyuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

CMD ["python", "main.py"]