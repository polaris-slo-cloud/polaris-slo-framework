import matplotlib.pyplot as plt


def plot_loss(loss_progression, avg_loss, save_dir, experiment):
    mean_loss = avg_loss
    plt.figure(figsize=(20, 8))
    plt.plot(loss_progression, '-', color='indigo', label='Loss', linewidth=2)
    plt.legend()
    plt.title("Loss evolution in test. Avg loss: " + f'{mean_loss:.6f}')
    plt.savefig(save_dir + experiment + "_loss.png")
    plt.close()


def plot_target(outputs, targets, avg_loss, save_dir, experiment):
    plt.figure(figsize=(30, 10))
    plt.plot(targets, '-', color='indigo', label='Target', linewidth=2)
    plt.plot(outputs, '--', color='limegreen', label='Forecast', linewidth=2)
    plt.legend()
    plt.title("Prediction in test. Avg loss: " + f'{avg_loss:.6f}')
    plt.savefig(save_dir + experiment + "_Prediction.png")
    plt.close()
