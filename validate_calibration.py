import pandas as pd
import numpy as np
import os

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    has_plt = True
except ImportError:
    has_plt = False

# Paths to datasets
arul_path = "datasets/Arulmozhi.csv"
abi_path = "datasets/blinkrate_data1.csv.xlsx"
artifact_dir = r"C:\Users\santh\.gemini\antigravity-ide\brain\4d37964f-4c47-4ab3-b2ad-56de48e8cdb0"

def evaluate_subject(df, name):
    print(f"\n==================== EVALUATION FOR {name} ====================")
    
    # Ground truth: blink_detection == 'Yes' means closed/blinking
    y_true = (df['blink_detection'] == 'Yes').astype(int).values
    ear = df['ear_smoothed'].values
    
    # 1. Static threshold simulation
    y_pred_static = (ear < 0.21).astype(int)
    
    # 2. Adaptive threshold simulation
    y_pred_adaptive = []
    threshold_history = []
    buffer = []
    
    for i in range(len(ear)):
        val = ear[i]
        
        # Calculate dynamic threshold from window of active open eyes (past 300 frames)
        if len(buffer) < 100:
            threshold = 0.21  # Fallback
        else:
            open_vals = [v for v in buffer if v >= 0.12]
            if len(open_vals) > 50:
                threshold = np.percentile(open_vals, 50) * 0.82
            else:
                threshold = np.percentile(buffer, 50) * 0.82
                
        pred = 1 if val < threshold else 0
        y_pred_adaptive.append(pred)
        threshold_history.append(threshold)
        
        # Update buffer
        buffer.append(val)
        if len(buffer) > 300:
            buffer.pop(0)
            
    y_pred_adaptive = np.array(y_pred_adaptive)
    threshold_history = np.array(threshold_history)
    
    # Calculate metrics
    def calculate_stats(true, pred):
        tp = np.sum((true == 1) & (pred == 1))
        fp = np.sum((true == 0) & (pred == 1))
        fn = np.sum((true == 1) & (pred == 0))
        tn = np.sum((true == 0) & (pred == 0))
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        accuracy = (tp + tn) / len(true)
        return accuracy, precision, recall, f1, (tp, fp, fn, tn)
        
    s_acc, s_prec, s_rec, s_f1, s_conf = calculate_stats(y_true, y_pred_static)
    a_acc, a_prec, a_rec, a_f1, a_conf = calculate_stats(y_true, y_pred_adaptive)
    
    # Print results table
    print(f"| Method | Accuracy | Precision | Recall | F1-Score | FP | FN |")
    print(f"| :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    print(f"| Static (0.21) | {s_acc:.4%} | {s_prec:.4%} | {s_rec:.4%} | {s_f1:.4f} | {s_conf[1]} | {s_conf[2]} |")
    print(f"| Adaptive | {a_acc:.4%} | {a_prec:.4%} | {a_rec:.4%} | {a_f1:.4f} | {a_conf[1]} | {a_conf[2]} |")
    
    # Generate visualization if matplotlib is available
    if has_plt:
        plt.figure(figsize=(12, 5))
        # Plot a segment of 1000 frames for readability
        start, end = 500, 2000
        frames = range(start, end)
        
        plt.plot(frames, ear[start:end], label='Smoothed EAR', color='#6366f1', linewidth=1.5)
        plt.axhline(y=0.21, color='#ef4444', linestyle='--', label='Static Threshold (0.21)', alpha=0.8)
        plt.plot(frames, threshold_history[start:end], color='#10b981', linestyle='-', label='Proposed Adaptive Threshold', linewidth=2)
        
        # Shade actual blink regions (ground truth)
        blinks_in_seg = np.where(y_true[start:end] == 1)[0] + start
        if len(blinks_in_seg) > 0:
            # Group consecutive frames of blinks to draw shading blocks
            plt.fill_between(frames, 0.05, 0.4, where=(y_true[start:end] == 1), color='#ef4444', alpha=0.15, label='Ground Truth Blink')
            
        plt.title(f'Ocular Threshold Tracking Segment - {name}', fontsize=12, fontweight='bold', pad=10)
        plt.xlabel('Frame Number', fontsize=10)
        plt.ylabel('Eye Aspect Ratio (EAR)', fontsize=10)
        plt.ylim(0.08, 0.35)
        plt.grid(True, linestyle=':', alpha=0.5)
        plt.legend(loc='upper right')
        plt.tight_layout()
        
        # Save plots
        plot_filename = f"calibration_comparison_{name.lower()}.png"
        plt.savefig(plot_filename, dpi=150)
        if os.path.exists(artifact_dir):
            plt.savefig(os.path.join(artifact_dir, plot_filename), dpi=150)
        print(f"Saved visualization plot to: {plot_filename}")
        plt.close()

# Load and run evaluation
print("Loading datasets...")
if os.path.exists(arul_path):
    df_arul = pd.read_csv(arul_path)
    evaluate_subject(df_arul, "Arulmozhi")
else:
    print(f"Error: Arulmozhi dataset not found at {arul_path}")

if os.path.exists(abi_path):
    df_abi = pd.read_excel(abi_path, sheet_name="Abisha")
    evaluate_subject(df_abi, "Abisha")
else:
    print(f"Error: Abisha dataset not found at {abi_path}")
